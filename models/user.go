package models

type User struct {
	Id uint `json:"id"`
	FirstName string `json:"firstname"`
	LastName string `json:"lastname"`
	Email string `json:"email"`
	Password string `json:"-"`
	Contact string `json:"contact"`
}