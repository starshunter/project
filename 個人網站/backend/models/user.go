package models

type User struct {
	ID        string `json:"id" bson:"_id"`
	UserName  string `json:"username"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Password  string `json:"password"`
}
