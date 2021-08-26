package models

import (
	"errors"
	"fmt"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

func init() {
	orm.RegisterModel(new(BorrowInformation))
}

type BorrowInformation struct {
	Id           int    `pk:"auto" json:"Id,omitempty"`
	Usernumber   string `json:"Usernumber"`
	Booknumber   string `json:"Booknumber"`
	Borrowstatus int    `json:"Borrowstatus"`
	Createtime   string `json:"Createtime"`
	Backtime     string `json:"Backtime,omitempty" orm:"null"`
}

type BorrowInfo struct {
	Usernumber   string
	Booknumber   string
	Borrowstatus int
	Createtime   string
	Username     string
}

func AddBorrowInformation(bo *BorrowInformation) error {
	dbObj := orm.NewOrm()

	_, err := dbObj.Insert(bo)

	if err != nil {
		errms := fmt.Sprintf("insert BorrowInformation: Usernumber=%s Booknumber=%s error! %s", bo.Usernumber, bo.Booknumber, err)
		logs.Error(errms, "\n")
		return errors.New(errms)
	}
	return nil

}

func UpdateBorrowInformation(bo *BorrowInformation) (err error) {
	dbObj := orm.NewOrm()

	num, err := dbObj.Update(bo)
	if err != nil {
		logs.Error(err.Error(), "\n")
		return err
	} else if num == 0 {
		logs.Error("Update for BorrowInformation Not Exist!", "\n")
		return errors.New("Update for BorrowInformation Not Exist!")
		// return nil
	}
	return nil
}

func GetBookByPerson(usernu string) (books []*Book, err error) {
	dbObj := orm.NewOrm()
	var lists []orm.ParamsList
	var bookSlice []*Book
	num, err := dbObj.QueryTable("BorrowInformation").Filter("Usernumber", usernu).Filter("Borrowstatus", 1).ValuesList(&lists, "Booknumber")
	if err == nil {
		fmt.Printf("Result Nums:%d\n", num)

		for _, row := range lists {

			fmt.Printf("Booknumber:%s", row[0])

			book := &Book{Booknumber: row[0].(string)}
			err := dbObj.Read(book, "Booknumber")
			if err != nil {

				logs.Debug("查询出错Booknumber:%s", row[0])
				return nil, err

			} else {
				// fmt.Println(user.Id, user.Name)
				bookSlice = append(bookSlice, book)

			}
		}

		return bookSlice, nil

	} else {

		return nil, err

	}

}

func GetPersonByBook(booknumber string) (borrowInfo *BorrowInfo, err error) {

	dbObj := orm.NewOrm()

	var bo BorrowInformation
	err = dbObj.QueryTable("BorrowInformation").Filter("Booknumber", booknumber).Filter("Borrowstatus", 1).One(&bo)

	if err == orm.ErrMultiRows {
		// 多条的时候报错
		fmt.Printf("Returned Multi Rows Not One")
		return nil, err
	}
	if err == orm.ErrNoRows {
		// 没有找到记录
		fmt.Printf("Not row found")
		return nil, err
	}

	user := User{Usernumber: bo.Usernumber}

	err = dbObj.Read(&user, "Usernumber")
	if err != nil {
		return nil, err
	}

	borrowInfo = &BorrowInfo{
		Usernumber:   bo.Usernumber,
		Booknumber:   bo.Booknumber,
		Borrowstatus: bo.Borrowstatus,
		Createtime:   bo.Createtime,
		Username:     user.Username,
	}

	return borrowInfo, nil

}

func GetBorrowInfoByBookbumber(booknumber []string, usernu string) (boSlice []*BorrowInformation, err error) {
	//根据booknumber查找borrowinfo表里的book信息且bookstatus为1的

	dbObj := orm.NewOrm()

	for _, item := range booknumber {
		var bo BorrowInformation
		err = dbObj.QueryTable("BorrowInformation").Filter("Booknumber", item).Filter("Usernumber", usernu).Filter("Borrowstatus", 1).One(&bo)

		if err == orm.ErrMultiRows {
			// 多条的时候报错
			fmt.Printf("Returned Multi Rows Not One")
			return nil, err
		} else if err == orm.ErrNoRows {
			// 没有找到记录
			fmt.Printf("Not row found")
			return nil, err
		}
		boSlice = append(boSlice, &bo)

	}

	return boSlice, nil

}
