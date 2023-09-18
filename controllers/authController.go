package controllers

import (
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/Abhijeet6387/blogappbackend/database"
	"github.com/Abhijeet6387/blogappbackend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var secretKey string

func init() {
	// Load .env file
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }
	secretKey = os.Getenv("SECRETKEY")
}

func validateEmail(email string) bool{
	Re := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z0-9._%+\-]`)
	return Re.MatchString(email)
}

func Register(c *fiber.Ctx) error{
	var data map[string]string
	var userData models.User
	
	if err := c.BodyParser(&data); err != nil{
		fmt.Println("Unable to Parse data")
	}

	// check if password is < 6 chars
	if len(data["password"]) <= 6{
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message":"Password length must be greater than 6",
		})
	}
	
	// check if email is correct
	if !validateEmail(strings.TrimSpace(data["email"])) {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message":"Invalid email address",
		})
	}
	
	// check if duplicate email
	database.DB.Where("email=?", strings.TrimSpace(data["email"])).First(&userData)
	if userData.Id != 0{
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message":"Email already exists",
		})
	}
	
	//  hashing password
	hashPassword, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)


	// saving data in user.Model instance
	user := models.User{
		FirstName: data["firstname"],
		LastName: data["lastname"],
		Password: string(hashPassword),
		Email: strings.TrimSpace(data["email"]),
		Contact: data["contact"],
	}

	database.DB.Create(&user)
	c.Status(fiber.StatusAccepted)
	return c.JSON(fiber.Map{
		"message":"User registered successfully",
		"user": user,
	})
}

func Login(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil{
		fmt.Println("Unable to parse data")
	}
	var user models.User
	database.DB.Where("email=?", data["email"]).First(&user)

	// If email is not found
	if user.Id == 0{
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message":"User not found",
		})
	}

	// Compare hashed password from database and password from the request
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"]))
	if err != nil{
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message" : "Incorrect password",
		})
	}

	// Generate jwt token with secretkey from .env file
	claimsMap := jwt.MapClaims{
		"IssuedBy": strconv.Itoa(int(user.Id)),
		"Email": user.Email,
		"ExpiresAt": time.Now().Add(time.Hour*24).Unix(),
	}
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsMap)
	token, err := claims.SignedString([]byte(secretKey))

	// if error occurs in generating token
	if err != nil{
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message":"Unable to login",
		})
	}
	// save the token information in cookie
	cookie := fiber.Cookie{
		Name: "jwt-token",
		Value: token,
		Expires: time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	// return response
	c.Status(fiber.StatusAccepted)
	return c.JSON(fiber.Map{
		"message":"Logged in successfully",
		"user":user,
	})
}

func GetUserInfo(c *fiber.Ctx) error {
	
	// Retrieve jwt token from the cookie
	cookie := c.Cookies("jwt-token")
	if cookie == "" {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Parse and validate the JWT token
	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error){
		return []byte(secretKey), nil
	})
	if err != nil{
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Check if the token is valid
	if !token.Valid {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Extract the claims from the token
	claims, ok := token.Claims.(*jwt.MapClaims)
	if !ok {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	// Extract information from claims
	userId:= (*claims)["IssuedBy"].(string)
	email := (*claims)["Email"].(string)

	var user models.User
	database.DB.Where("id=? AND email=?", userId, email).First(&user)

	if(user.Id == 0){
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message":"User Not Found",
		})
	}else{
		c.Status(fiber.StatusAccepted)
		return c.JSON(fiber.Map{
			"message":"User Authorized",
			"user": user,
		})
	}
}