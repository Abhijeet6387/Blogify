package routes
import (
	"github.com/Abhijeet6387/blogappbackend/controllers"
	"github.com/gofiber/fiber/v2"
)
func UserRoutes(app *fiber.App){
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login",controllers.Login)
	app.Get("/api/userInfo", controllers.GetUserInfo)
}