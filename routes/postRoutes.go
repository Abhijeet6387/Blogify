package routes
import (
	"github.com/Abhijeet6387/blogappbackend/controllers"
	"github.com/gofiber/fiber/v2"
)

func PostRoutes(app *fiber.App){
	app.Post("/api/post", controllers.CreatePost)
	app.Get("/api/allposts", controllers.GetAllPosts)
	app.Get("/api/myposts",controllers.UniquePost)
	app.Get("/api/allposts/:id", controllers.DetailPost)
	app.Put("/api/allposts/:id/update", controllers.UpdatePost)
	app.Delete("/api/allposts/:id/delete", controllers.DeletePost)
}