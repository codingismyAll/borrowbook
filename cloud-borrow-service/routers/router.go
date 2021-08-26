// @APIVersion 1.0.0
// @Title beego Test API
// @Description beego has a very cool tools to autogenerate documents for your API
// @Contact astaxie@gmail.com
// @TermsOfServiceUrl http://beego.me/
// @License Apache 2.0
// @LicenseUrl http://www.apache.org/licenses/LICENSE-2.0.html
package routers

import (
	"cloud-borrow-service/controllers"

	"github.com/astaxie/beego"
)

func init() {

	beego.Router("/borrowservice/user", &controllers.UserController{}, "post:CreateUser")
	beego.Router("/borrowservice/user", &controllers.UserController{}, "get:GetAll")
	beego.Router("/borrowservice/user/:id", &controllers.UserController{}, "put:UpdateUser")
	beego.Router("/borrowservice/deleteuser", &controllers.UserController{}, "post:DeleteMuiltyUser")

	beego.Router("/borrowservice/getuser", &controllers.UserController{}, "get:GetUserByUsernumber")
	// beego.Router("/borrowservice/login", &controllers.UserController{}, "post:Login")
	// beego.Router("/borrowservice/logout", &controllers.UserController{}, "post:Logout")

	//借书
	beego.Router("/borrowservice/borrowbook", &controllers.BorrowController{}, "post:BorrowBook")
	//还书
	beego.Router("/borrowservice/givebackbook", &controllers.BorrowController{}, "post:GiveBackBook")
	//查询某人借书记录
	beego.Router("/borrowservice/getborrowrecord", &controllers.BorrowController{}, "get:GetBookByPerson")

	//查询书被谁借走
	beego.Router("/borrowservice/borrowinfo", &controllers.BorrowController{}, "get:GetBorrowInfoByBook")
	//根据输入字段进行搜索书籍
	beego.Router("/borrowservice/getbook", &controllers.BookController{}, "get:GetAllByBookname")
	//添加书
	beego.Router("/borrowservice/book", &controllers.BookController{}, "post:CreateBook")

	beego.Router("/borrowservice/book", &controllers.BookController{}, "get:GetAll")

	beego.Router("/borrowservice/deletebook", &controllers.BookController{}, "post:DeleteMuiltyBooks")

	beego.Router("/borrowservice/book/:id", &controllers.BookController{}, "put:UpdateBook")

	beego.Router("/*", &controllers.CorsController{}, "options:CorsCheck")
}
