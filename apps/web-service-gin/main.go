package main

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/joho/godotenv"
	"github.com/samber/lo"
)

// album represents data about a record album.
type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

type LogtoUser struct {
	Sub              string      `json:"sub"`
	Name             string      `json:"name"`
	Picture          interface{} `json:"picture"`
	UpdatedAt        int64       `json:"updated_at"`
	Username         string      `json:"username"`
	CreatedAt        int64       `json:"created_at"`
	Organizations    []string    `json:"organizations"`
	OrganizationData []struct {
		ID          string      `json:"id"`
		Name        string      `json:"name"`
		Description interface{} `json:"description"`
	} `json:"organization_data"`
	OrganizationRoles []string      `json:"organization_roles"`
	Roles             []interface{} `json:"roles"`
}

type AuthToken struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
}

type UserOrgPermissions struct {
	TenantID string `json:"tenantId"`
	ID       string `json:"id"`
	Name     string `json:"name"`
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

func getAccessToken() (string, error) {
	tokenEndpoint := os.Getenv("LOGTO_ENDPOINT") + "/oidc/token"
	applicationId := os.Getenv("LOGTO_CLIENT_ID")
	applicationSecret := os.Getenv("LOGTO_CLIENT_SECRET")

	// Prepare the URL-encoded form data
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("resource", "https://default.logto.app/api")
	data.Set("scope", "all")

	client := resty.New()
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetBasicAuth(applicationId, applicationSecret).
		SetBody(data).
		SetResult(AuthToken{}).
		Post(tokenEndpoint)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	return resp.Result().(*AuthToken).AccessToken, nil
}

func getUserInfo(userToken string) (*LogtoUser, error) {

	userinfoEndpoint := os.Getenv("LOGTO_ENDPOINT") + "/oidc/me"

	client := resty.New()
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetAuthToken(userToken).
		SetResult(LogtoUser{}).
		Get(userinfoEndpoint)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return resp.Result().(*LogtoUser), nil
}

func getUserPermissionsForOrg(userId string, orgId string, token string) ([]UserOrgPermissions, error) {
	url := os.Getenv("LOGTO_ENDPOINT") + "/api/organizations/" + orgId + "/users/" + userId + "/scopes"
	client := resty.New()
	var permissions []UserOrgPermissions
	_, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetAuthToken(token).
		SetResult(&permissions).
		Get(url)
	if err != nil {
		fmt.Println("Error Fetching User Permissions:", err)
		return nil, err
	}
	return permissions, nil
}

func userPermissionsHandler(c *gin.Context) {
	orgId := c.Param("orgId")
	userToken := strings.Split(c.Request.Header["Authorization"][0], " ")[1]
	if userToken == "" {
		fmt.Println("Missing userToken")
		c.AbortWithStatus(403)
		return
	}

	user, err := getUserInfo(userToken)
	if err != nil {
		fmt.Println("Error Fetching User:", err)
		c.AbortWithError(500, err)
		return
	}

	managementToken, err := getAccessToken()
	if err != nil {
		fmt.Println("Error Fetching management token:", err)
		c.AbortWithError(500, err)
		return
	}

	permissions, err := getUserPermissionsForOrg(user.Sub, orgId, managementToken)
	if err != nil {
		fmt.Println("Error Fetching User:", err)
		c.AbortWithError(500, err)
		return
	}

	scopes := lo.Map(permissions, func(permission UserOrgPermissions, _ int) string {
		return permission.Name
	})

	c.Header("Content-Type", "application/json")
	c.JSON(200, gin.H{"scopes": scopes})
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/albums", getAlbums)
	router.GET("/organizations/:orgId/user/permissions", userPermissionsHandler)

	router.Run("localhost:8080")
}
