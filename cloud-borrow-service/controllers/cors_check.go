package controllers

import (
	"net/http"

	"github.com/astaxie/beego"
)

type CorsController struct {
	beego.Controller
}

func (c *CorsController) CorsCheck() {
	c.Ctx.ResponseWriter.Header().Set("Access-Control-Allow-Origin", "*")
	c.Ctx.ResponseWriter.Header().Set("Access-Control-Allow-Methods", "POST,GET,DELETE,PUT,OPTIONS")
	// c.Ctx.ResponseWriter.Header().Set("Access-Control-Allow-Headers", "*")
	c.Ctx.ResponseWriter.Header().Set("Access-Control-Allow-Headers", "Authentication,Origin, X-Requested-With, Content-Type, Accept,token")
	c.Ctx.ResponseWriter.Header().Set("Access-Control-Max-Age", "1")
	c.Ctx.ResponseWriter.WriteHeader(http.StatusOK)
}
