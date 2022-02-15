package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/starshunter/PersonalBlogAPI/controllers"
)

func SetupRoutes(app *fiber.App) {
	auth := app.Group("/auth")
	admin := app.Group("/admin", controllers.JWT_MIDDLEWARE)
	api := app.Group("/api")

	authV1 := auth.Group("/v1")
	adminV1 := admin.Group("/v1")
	apiV1 := api.Group("/v1")

	authV1.Post("/register", controllers.Register)
	authV1.Post("/login", controllers.Login)
	adminV1.Get("/test", controllers.Test)
	adminV1.Post("/blog", controllers.PostBlog)
	adminV1.Delete("/blog", controllers.DeleteBlog)
	adminV1.Get("/updateToken", controllers.UpdateToken)
	adminV1.Get("/refresh_token", controllers.UpdateToken)
	apiV1.Get("/allBlog", controllers.GetAllBlog)
	apiV1.Get("/allBlogIds", controllers.GetAllBlogIDs)
	apiV1.Get("/blog", controllers.GetBlog)
	apiV1.Get("/blogByPage", controllers.GetBlogByPage)
	apiV1.Get("/idByPage", controllers.GetIDByPage)

	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"msg": "this route is invalid",
		})
	})
}
