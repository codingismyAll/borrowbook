package main

import (
	"cloud-borrow-service/conf"
	_ "cloud-borrow-service/routers"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

//初始化orm
func init() {
	appopt := conf.NewAppOpt()
	conn := appopt.MysqlOpt.Username + ":" + appopt.MysqlOpt.MSPassword + "@tcp(" + appopt.MysqlOpt.Endpoint + ")/" + appopt.MysqlOpt.DBname + "?charset=utf8" //组合成连接串

	//conn := dbuser + ":" + dbpwd + "@/" + dbname + "?charset=utf8" //组合成连接串
	orm.RegisterDriver("mysql", orm.DRMySQL)       //注册mysql驱动
	orm.RegisterDataBase("default", "mysql", conn) //设置conn中的数据库为默认使用数据库
	mdb, err := orm.GetDB("default")
	if err != nil {
		logs.Error("get db error:", err)
	}
	mdb.SetConnMaxLifetime(time.Second * 28800)
	orm.RunSyncdb("default", false, false) //后一个使用true会带上很多打印信息，数据库操作和建表操作的；第二个为true代表强制创建表
}

func main() {
	// if beego.BConfig.RunMode == "dev" {
	// 	beego.BConfig.WebConfig.DirectoryIndex = true
	// 	beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
	// }
	beego.Run()
}
