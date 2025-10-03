package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Book struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Title  string `json:"title"`
	Author string `json:"author"`
}

var db *gorm.DB
var err error

func main() {
	// Connect DB
	db, err = gorm.Open(sqlite.Open("books.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&Book{})

	r := gin.Default()

	// Serve React app
	r.Static("/static", "./frontend/dist/static")
	r.StaticFile("/", "./frontend/dist/index.html")

	// API routes
	api := r.Group("/api")
	{
		api.GET("/books", getBooks)
		api.GET("/books/:id", getBook)
		api.POST("/books", createBook)
		api.PUT("/books/:id", updateBook)
		api.DELETE("/books/:id", deleteBook)
	}

	// Catch-all route to serve React app for client-side routing
	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/build/index.html")
	})

	r.Run(":8001")
}

// Handlers
func getBooks(c *gin.Context) {
	var books []Book
	db.Find(&books)
	c.JSON(http.StatusOK, books)
}

func getBook(c *gin.Context) {
	id := c.Param("id")
	var book Book
	if err := db.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	c.JSON(http.StatusOK, book)
}

func createBook(c *gin.Context) {
	var book Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&book)
	c.JSON(http.StatusCreated, book)
}

func updateBook(c *gin.Context) {
	id := c.Param("id")
	var book Book
	if err := db.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	var input Book
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	book.Title = input.Title
	book.Author = input.Author
	db.Save(&book)

	c.JSON(http.StatusOK, book)
}

func deleteBook(c *gin.Context) {
	id := c.Param("id")
	var book Book
	if err := db.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	db.Delete(&book)
	c.JSON(http.StatusOK, gin.H{"message": "Book deleted"})
}
