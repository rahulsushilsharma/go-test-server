package main

import (
	"net/http" // Import the http package for status codes

	"github.com/gin-gonic/gin" // Import the Gin framework
)

func main() {
	// Create a new Gin router with default middleware (logger and recovery)
	router := gin.Default()

	// Define a GET endpoint at the root path "/"
	router.GET("/", func(c *gin.Context) {
		// Respond with a JSON message and an HTTP 200 OK status
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, Gin!",
		})
	})

	// Run the server on port 8080
	// By default, Gin will listen on :8080
	println("Server is running on http://localhost:8080")
	router.Run(":8080")
}
