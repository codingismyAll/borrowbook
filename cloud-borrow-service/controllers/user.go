package controllers

import (
	"cloud-borrow-service/models"
	"cloud-borrow-service/utils/errorutil"
	"cloud-borrow-service/utils/httputil"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
)

// Operations about Users
type UserController struct {
	beego.Controller
}
type UserResource struct {
	Username   string
	Usernumber string
	Department string
}

type DdeleteUser struct {
	Userids []int
}

func (u *UserController) CreateUser() {

	var userResource UserResource
	json.Unmarshal(u.Ctx.Input.RequestBody, &userResource)

	user := &models.User{
		Username:   userResource.Username,
		Usernumber: userResource.Usernumber,
		Department: userResource.Department,
	}

	if err := models.AddUser(user); err != nil {
		logs.Info(err.Error(), "Username = ", userResource.Username)
		httputil.WriteERROR(u.Ctx.ResponseWriter, http.StatusOK, err, errorutil.CreateUserFailed)
		return
	}
	httputil.WriteJSON(u.Ctx.ResponseWriter, http.StatusCreated, "Succeed!")
}

func (u *UserController) GetAll() {

	users, err := models.GetAllUsers()
	if err != nil {
		logs.Info(err.Error())
		httputil.WriteERROR(u.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectAllUserFailed)
		return
	}

	httputil.WriteJSON(u.Ctx.ResponseWriter, http.StatusOK, users)
}

func (u *UserController) DeleteMuiltyUser() {

	var delteUser DdeleteUser
	json.Unmarshal(u.Ctx.Input.RequestBody, &delteUser)
	logs.Info("delteUser.ids!!!", delteUser.Userids)

	ids := delteUser.Userids
	err := models.DeleteUser(ids)
	if err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(u.Ctx.ResponseWriter, http.StatusOK, err, errorutil.DeleteUserFailed)
		return
	}

	httputil.WriteJSON(u.Ctx.ResponseWriter, http.StatusOK, "Succeed!")
}

func (u *UserController) UpdateUser() {

	id, err := strconv.Atoi(u.Ctx.Input.Param(":id"))
	if err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(u.Ctx.ResponseWriter, http.StatusOK, err, errorutil.StrconvFailed)
		return
	}
	user, err := models.GetUser(id)
	if err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(u.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectUserByIDFailed)
		return
	}

	var userResource UserResource
	json.Unmarshal(u.Ctx.Input.RequestBody, &userResource)

	if userResource.Username != "" {
		user.Username = userResource.Username
	}
	if userResource.Usernumber != "" {
		user.Usernumber = userResource.Usernumber
	}
	if userResource.Department != "" {
		user.Department = userResource.Department
	}

	if err := models.UpdateUser(user); err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(u.Ctx.ResponseWriter, http.StatusOK, err, errorutil.UpdateUserFailed)
		return
	}

	httputil.WriteJSON(u.Ctx.ResponseWriter, http.StatusOK, "Succeed!")

}

func (u *UserController) GetUserByUsernumber() {
	usernumber := u.GetString("usernumber")
	user, err := models.GetUserByUsernumber(usernumber)
	if err != nil {
		httputil.WriteERROR(u.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectUsernumberFailed)
		return
	}

	httputil.WriteJSON(u.Ctx.ResponseWriter, http.StatusOK, user)
}
