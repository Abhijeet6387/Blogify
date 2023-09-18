package controllers

import (
	"errors"
	"log"
	"strconv"

	"github.com/Abhijeet6387/blogappbackend/database"
	"github.com/Abhijeet6387/blogappbackend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

func ParseJWT(cookie string, c *fiber.Ctx) (string, error){
if cookie == "" {
		c.Status(fiber.StatusUnauthorized)
		return "", c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Parse and validate the JWT token
	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error){
		return []byte(secretKey), nil
	})
	if err != nil{
		c.Status(fiber.StatusUnauthorized)
		return "",c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Check if the token is valid
	if !token.Valid {
		c.Status(fiber.StatusUnauthorized)
		return "", c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Extract the claims from the token
	claims, ok := token.Claims.(*jwt.MapClaims)
	if !ok {
		c.Status(fiber.StatusInternalServerError)
		return "", c.JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	// Extract userid from claims
	user_id := (*claims)["IssuedBy"].(string)
	return user_id, c.SendString("Fetched user Id")
}

func CreatePost(c *fiber.Ctx) error {
	var blogpost models.Blog
	if err := c.BodyParser(&blogpost); err != nil{
		log.Println("Unable to parse body")
	}
	if err := database.DB.Create(&blogpost).Error; err != nil{
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message":"Invalid payload",
		})
	}
	c.Status(fiber.StatusAccepted)
	return c.JSON(fiber.Map{
		"message":"Congrats!, Your post is live",
	})
}

func GetAllPosts(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit := 5
	offset := (page-1)*limit
	var total int64
	var getblogs []models.Blog

	database.DB.Preload("User").Offset(offset).Limit(limit).Find(&getblogs)
	database.DB.Model(&models.Blog{}).Count(&total)
	
	c.Status(fiber.StatusAccepted)
	return c.JSON(fiber.Map{
		"message":"Fetched all the posts",
		"data": getblogs,
		"meta": fiber.Map{
			"total": total,
			"page":page,
			"lastpage": (total + int64(limit) -1) / int64(limit),
		},
	})
}

func UniquePost(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt-token")
	user_id, _ := ParseJWT(cookie, c)
	var blog []models.Blog
	database.DB.Model(&blog).Where("user_id=?",user_id).Preload("User").Find(&blog)

	c.Status(fiber.StatusAccepted)
	return c.JSON(blog)
}

func DetailPost(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var blogpost models.Blog

	database.DB.Where("id=?", id).Preload("User").First(&blogpost)
	c.Status(fiber.StatusAccepted)
	return c.JSON(fiber.Map{
		"message":"Details of post",
		"data": blogpost,
	})
}

func UpdatePost(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt-token")
	user_id, _ := ParseJWT(cookie, c);

	post_id, _ := strconv.Atoi(c.Params("id"))
	blog := models.Blog{
		Id : uint(post_id),
	}
	if err := c.BodyParser(&blog); err != nil{
		log.Println("Unable to Parse body")
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message":"Invalid request",
		})
	}

	if user_id == blog.UserID {
		log.Printf("Blog.UserID- %v, UserID- %v",blog.UserID, user_id)
		database.DB.Model(&blog).Updates(blog)
		c.Status(fiber.StatusAccepted)
		return c.JSON(fiber.Map{
			"message": "Post updated",
		})
	} else{
		c.Status(fiber.StatusMethodNotAllowed)
		return c.JSON(fiber.Map{
			"message":"Can't be updated",
		})
	}
}


func DeletePost(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt-token")
	user_id, _ := ParseJWT(cookie, c)

	post_id, _ := strconv.Atoi(c.Params("id"))
	
	var blog models.Blog
	database.DB.Where("id=?",uint(post_id)).First(&blog)
	// log.Printf("UserID %v, Blog.UserID %v",user_id, blog.UserID)

	if user_id == blog.UserID{
		deleteQuery := database.DB.Delete(&blog)
		if errors.Is(deleteQuery.Error, gorm.ErrRecordNotFound){
			c.Status(fiber.StatusNotFound)
				return c.JSON(fiber.Map{
				"message":"Record not found",
			})
		}else{
			c.Status(fiber.StatusAccepted)
			return c.JSON(fiber.Map{
				"message":"Deleted successfully",
			})
		}
	}else{
		c.Status(fiber.StatusMethodNotAllowed)
		return c.JSON(fiber.Map{
			"message":"Can't be deleted",
		})
	}

}