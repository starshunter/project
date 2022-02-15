package models

import "time"

type Blog struct {
	ID    string    `bson:"_id"`
	Title string    `bson:"title"`
	Body  string    `bson:"body"`
	Time  time.Time `bson:"time"`
}
