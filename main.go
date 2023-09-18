package main

import (
	"log"
	"os"

	"github.com/Abhijeet6387/blogappbackend/database"
	"github.com/Abhijeet6387/blogappbackend/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	envErr := godotenv.Load(".env")
	if envErr != nil{
		log.Fatal("Unable to load .env file!")
	}

	// Connect to database
	database.Connect()

	// Create a new Fiber Instance
	app := fiber.New()

	// Routes
	routes.Setup(app) 			// Setup Route - serveHome
	routes.UserRoutes(app)		// Users Route - Register, Login, GetUserInfo
	routes.PostRoutes(app)		// Posts Route - CreatePost

	// Fetch port from .env file, Listen to port
	port := os.Getenv("PORT")
	app.Listen(":"+ port)
}