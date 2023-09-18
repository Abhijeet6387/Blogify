package controllers

import (
	"log"
	"math/rand"

	"github.com/gofiber/fiber/v2"
)

// for saving images attached with random strings generated
var letters = []rune("abcdefghijklmnopqrstuvwxyz")
func randomLetter(n int) string {
	str := make([]rune, n)
	for i := range str{
		str[i] = letters[rand.Intn(len(letters))]
	}
	return string(str)
}

func Upload(c *fiber.Ctx) error {
	form, err := c.MultipartForm()
	if err != nil{
		return err
	}
	files := form.File["image"]
	fileName := ""

	for _,file := range files{
		fileName = randomLetter(5) + "-" + file.Filename
		if err := c.SaveFile(file , "./static/" + fileName); err != nil{
			log.Println("Problem")
			return nil
		}
	}
	return c.JSON(fiber.Map{
		"url": "http://localhost:5000/api/uploads/"+fileName,
	})
}