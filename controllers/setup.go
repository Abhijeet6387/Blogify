package controllers

import ("github.com/gofiber/fiber/v2")

func ServeHome(c *fiber.Ctx) error{
	return c.SendString("Welcome Home")
}