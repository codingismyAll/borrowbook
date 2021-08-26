package conf

import (
	"github.com/astaxie/beego"
)

type AppOpt struct {
	MysqlOpt
	RedisHost  string
	InfluxHost string
}

type MysqlOpt struct {
	DBname     string
	Username   string
	MSPassword string
	Endpoint   string
}

func NewAppOpt() AppOpt {
	appopt := AppOpt{}

	appopt.MysqlOpt.DBname = beego.AppConfig.String("dbname")
	appopt.MysqlOpt.Username = beego.AppConfig.String("dbuser")
	appopt.MysqlOpt.MSPassword = beego.AppConfig.String("dbpwd")
	appopt.MysqlOpt.Endpoint = beego.AppConfig.String("dbendpoint")

	return appopt
}
