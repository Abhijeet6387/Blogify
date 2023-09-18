package routes

import (
	"github.com/Abhijeet6387/blogappbackend/controllers"
	"github.com/gofiber/fiber/v2"
)
func Setup(app *fiber.App){
	app.Get("/", controllers.ServeHome)
}