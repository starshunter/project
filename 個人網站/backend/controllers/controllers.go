package controllers

import (
	"math"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	"github.com/starshunter/PersonalBlogAPI/config"
	"github.com/starshunter/PersonalBlogAPI/models"
)

const SecretKey = "secret"

func JWT_MIDDLEWARE(c *fiber.Ctx) error {
	// get cookie from context
	cookie := c.Cookies("jwt")

	// parse jwt token from cookie
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	// fail to parse token
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated, failed to parse token",
		})
	}

	// get claims from token
	claims := token.Claims.(*jwt.StandardClaims)

	// select user collection
	userCollection := config.MI.DB.Collection(os.Getenv("USER_COLLECTION"))

	// parse user ID from claims
	userID, err := primitive.ObjectIDFromHex(claims.Issuer)

	// fail to parse user ID
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated, failed to parse user ID",
		})
	}

	// get user from database by user ID
	user := new(models.User)
	query := bson.D{{Key: "_id", Value: userID}}

	// user ID doesn't exist
	if err := userCollection.FindOne(c.Context(), query).Decode(user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "fail to authenticate user",
		})
	}

	// ======================================================================
	// refresh token and cookie

	// construct new claims with new expire time
	new_claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    claims.Issuer,
		ExpiresAt: time.Now().Add(time.Minute * 15).Unix(),
	})

	// make new token
	new_token, err := new_claims.SignedString([]byte(SecretKey))

	// failed new token
	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "cannot make new token",
		})
	}

	// make new cookie
	new_cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    new_token,
		Expires:  time.Now().Add(time.Minute * 15),
		HTTPOnly: true,
	}

	// attach cookie
	c.Cookie(&new_cookie)

	// =================================================================

	// pass user data to next middleware
	c.Locals("user", user)
	return c.Next()
}

func Register(c *fiber.Ctx) error {
	// select user collection
	userCollection := config.MI.DB.Collection(os.Getenv("USER_COLLECTION"))

	// parse data from the request
	data := new(models.User)

	// cannot parse data from the request
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "fail to parse JSON",
			"error":   err,
		})
	}

	// use bcrypt to generate hashed password
	password, _ := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

	data.Password = string(password)

	// insert new user into database
	result, err := userCollection.InsertOne(c.Context(), data)

	// cannot insert new user
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "cannot insert data",
			"error":   err,
		})
	}

	inserted := &models.User{}
	query := bson.D{{Key: "_id", Value: result.InsertedID}}

	// get inserted user
	userCollection.FindOne(c.Context(), query).Decode(inserted)

	return c.JSON(fiber.Map{
		"success": true,
		"message": inserted,
	})
}

func Login(c *fiber.Ctx) error {
	// select user collection
	userCollection := config.MI.DB.Collection(os.Getenv("USER_COLLECTION"))

	// parse data from the request
	var data map[string]string

	// cannot parse data from the request
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "fail to parse JSON",
			"error":   err,
		})
	}

	// get user from database by username
	user := new(models.User)
	query := bson.D{{Key: "username", Value: data["username"]}}

	// username doesn't exist
	if err := userCollection.FindOne(c.Context(), query).Decode(user); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"success": false,
			"message": "username does not exist",
		})
	}

	// input password is incorrect
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"success": false,
			"message": "incorrect password",
		})
	}

	// make jwt claim
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    user.ID,
		ExpiresAt: time.Now().Add(time.Minute * 15).Unix(),
	})

	// make token
	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "cannot login",
		})
	}

	// make cookie
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Minute * 15),
		HTTPOnly: true,
		SameSite: "none",
		Secure:   true,
	}

	// attach cookie
	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"success":  true,
		"username": user.UserName,
	})
}

func Test(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"success": true,
		"user":    c.Locals("user"),
	})
}

func GetAllBlog(c *fiber.Ctx) error {
	// select blog collection
	blogCollection := config.MI.DB.Collection(os.Getenv("BLOG_COLLECTION"))

	// query the database to find all blog object and get the cursor
	cursor, err := blogCollection.Find(c.Context(), bson.D{})

	// error has occurred when retrieving cursor
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "something went wrong when trying to do a query in database",
		})
	}

	var allBlog []bson.M

	// cannot parse object using cursor
	if err := cursor.All(c.Context(), &allBlog); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "fail to parse query result",
		})
	}

	// return requested object
	return c.JSON(fiber.Map{
		"success": true,
		"allBlog": allBlog,
	})
}

func GetAllBlogIDs(c *fiber.Ctx) error {
	// select blog collection
	blogCollection := config.MI.DB.Collection(os.Getenv("BLOG_COLLECTION"))

	// query the database to find all blog's ID and get the cursor
	cursor, err := blogCollection.Find(c.Context(), bson.D{}, options.Find().SetProjection(bson.M{"_id": 1}))

	// error has occurred when retrieving cursor
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "something went wrong when trying to do a query in database",
		})
	}

	var allBlogIDs []bson.M

	// cannot parse object using cursor
	if err := cursor.All(c.Context(), &allBlogIDs); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "fail to parse query result",
		})
	}

	// return requested object
	return c.JSON(fiber.Map{
		"success": true,
		"result":  allBlogIDs,
	})
}

func GetBlog(c *fiber.Ctx) error {
	// select blog collection
	blogCollection := config.MI.DB.Collection(os.Getenv("BLOG_COLLECTION"))

	// get blog ID from query and convert to objectID
	ID, err := primitive.ObjectIDFromHex(c.Query("id"))
	var blog bson.M
	query := bson.D{{Key: "_id", Value: ID}}

	// failed to convert to objectID
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "failed to parse blog ID",
		})
	}

	// query the database to find all blog object and get the cursor
	if err := blogCollection.FindOne(c.Context(), query).Decode(&blog); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "cannot quey in database",
		})
	}

	// return requested object
	return c.JSON(fiber.Map{
		"success": true,
		"blog":    blog,
	})
}

func GetBlogByPage(c *fiber.Ctx) error {
	// get page from query and convert it to int
	page, err := strconv.Atoi(c.Query("page"))

	// failed to convert to int
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "failed to parse page",
		})
	}

	if page < 1 {
		page = 1
	}

	// select blog collection
	blogCollection := config.MI.DB.Collection(os.Getenv("BLOG_COLLECTION"))

	// set options for query
	findOptions := options.Find()
	findOptions.SetLimit(10)
	findOptions.SetSkip(int64((page - 1) * 10))
	findOptions.SetSort(bson.M{"time": -1})

	// query the database to find blogs on specifice page and get the cursor
	cursor, err := blogCollection.Find(c.Context(), bson.D{}, findOptions)

	// error has occurred when retrieving cursor
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "something went wroong when trying to do a query in database",
		})
	}

	var blogs []bson.M

	// cannot parse object using cursor
	if err := cursor.All(c.Context(), &blogs); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "fail to parse query result",
		})
	}

	// get total doucment count in blog collection
	pages, err := blogCollection.CountDocuments(c.Context(), bson.D{})

	// failed to get total document
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "something went wroong when trying to quey document count in database",
		})
	}

	// return requested object and total page count
	return c.JSON(fiber.Map{
		"success": true,
		"blogs":   blogs,
		"pages":   math.Ceil(float64(pages) / float64(10)),
	})
}

func GetIDByPage(c *fiber.Ctx) error {
	// get page from query and convert it to int
	page, err := strconv.Atoi(c.Query("page"))

	// failed to convert to int
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "failed to parse page",
		})
	}

	if page < 1 {
		page = 1
	}

	// select blog collection
	blogCollection := config.MI.DB.Collection(os.Getenv("BLOG_COLLECTION"))

	// set options for query
	findOptions := options.Find()
	findOptions.SetLimit(10)
	findOptions.SetSkip(int64((page - 1) * 10))
	findOptions.SetSort(bson.M{"time": -1})
	findOptions.SetProjection(bson.M{"_id": 1})

	// query the database to find blogs' ID on specifice page and get the cursor
	cursor, err := blogCollection.Find(c.Context(), bson.D{}, findOptions)

	// error has occurred when retrieving cursor
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "something went wroong when trying to do a query in database",
		})
	}

	var IDs []bson.M

	// cannot parse object using cursor
	if err := cursor.All(c.Context(), &IDs); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "fail to parse query result",
		})
	}

	// return requested object and total page count
	return c.JSON(fiber.Map{
		"success": true,
		"ids":     IDs,
	})
}

func PostBlog(c *fiber.Ctx) error {
	// select blog collection
	blogCollection := config.MI.DB.Collection(os.Getenv("BLOG_COLLECTION"))

	// parse data from the request
	blog := new(models.Blog)

	// cannot parse data from the request
	if err := c.BodyParser(&blog); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "fail to parse JSON",
			"error":   err,
		})
	}

	// set blog object created time to now
	blog.Time = time.Now()

	// insert new blog into database
	result, err := blogCollection.InsertOne(c.Context(), blog)

	// cannot insert new blog
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "cannot insert data",
			"error":   err,
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"result":  result,
	})
}

func DeleteBlog(c *fiber.Ctx) error {
	// select blog collection
	blogCollection := config.MI.DB.Collection(os.Getenv("BLOG_COLLECTION"))

	// get blog ID from query and convert to objectID
	ID, err := primitive.ObjectIDFromHex(c.Query("id"))

	// failed to convert to objectID
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "failed to parse blog ID",
		})
	}

	// delete blog with specific ID from database
	result, err := blogCollection.DeleteOne(c.Context(), bson.M{"_id": ID})

	// error has occurred when deleting blog
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "cannot delete blog",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"result":  result,
	})
}

func UpdateToken(c *fiber.Ctx) error {

	return c.SendStatus(200)
}
