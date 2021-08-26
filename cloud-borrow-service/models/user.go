package models

import (
	"errors"
	"fmt"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

var (
	UserList map[string]*User
)

func init() {
	orm.RegisterModel(new(User))
}

type User struct {
	Id         int    `pk:"auto" json:"Id,omitempty"`
	Username   string `json:"Username"`
	Usernumber string `json:"Usernumber"`
	Department string `json:"Department"`
}

func GetUsername(usernu string) (username string, err error) {
	dbObj := orm.NewOrm()
	user := &User{Usernumber: usernu}
	if err := dbObj.Read(user, "Usernumber"); err != nil {
		return "", err
	}
	return user.Username, nil

}
func AddUser(u *User) error {
	dbObj := orm.NewOrm()

	_, err := dbObj.Insert(u)

	if err != nil {
		errms := fmt.Sprintf("insert user: Username=%s error! %s", u.Username, err)
		fmt.Printf(errms, "\n")
		return errors.New(errms)
	}

	return nil
}

func DeleteUser(ids []int) error {
	dbObj := orm.NewOrm()

	for _, uid := range ids {
		if num, err := dbObj.Delete(&User{Id: uid}); err != nil {
			return err
		} else if num == 0 {
			return errors.New("User not exists")
		}

	}
	return nil
}

func UpdateUser(u *User) error {
	dbObj := orm.NewOrm()
	num, err := dbObj.Update(u)

	if err != nil {
		return err
	} else if num == 0 {
		logs.Info("no num update")
		return nil
	}

	return nil
}

func GetAllUsers() ([]*User, error) {
	var users []*User
	dbObj := orm.NewOrm()
	_, err := dbObj.QueryTable("User").All(&users)
	if err != nil {
		return nil, errors.New("Get ALL users error!")
	}
	return users, nil
}
func GetUser(id int) (u *User, err error) {
	dbObj := orm.NewOrm()
	u = &User{Id: id}
	err = dbObj.Read(u)

	if err != nil {
		return nil, errors.New("User not exists")
	}
	return u, nil
}

func GetUserByUsernumber(usernumber string) (u *User, err error) {
	dbObj := orm.NewOrm()
	u = &User{Usernumber: usernumber}

	err = dbObj.Read(u, "Usernumber")

	if err == orm.ErrNoRows {
		fmt.Println("查询不到")
		return nil, nil
	} else if err == orm.ErrMissPK {
		fmt.Println("找不到主键")
		return nil, err
	}
	return u, nil
}
