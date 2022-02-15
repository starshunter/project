package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	"github.com/starshunter/PersonalBlogAPI/config"
	"github.com/starshunter/PersonalBlogAPI/routes"
)

func main() {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "https://peter-personal-blog.herokuapp.com",
		AllowMethods:     "GET,POST,DELETE,PUT,OPTIONS,CONNECT",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config.ConnectDB()

	routes.SetupRoutes(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "You are at the endpoint",
		})
	})

	port := os.Getenv("PORT")
	mode := os.Getenv("MODE")
	var listen string

	if mode == "DEV" {
		listen = "127.0.0.1:" + port
	} else {
		listen = ":" + port
	}

	err = app.Listen(listen)

	if err != nil {
		panic(err)
	}
}
