package models

import (
	"errors"
	"fmt"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

func init() {
	orm.RegisterModel(new(Book))
}

type Book struct {
	Id          int    `pk:"auto" json:"Id,omitempty"`
	Bookname    string `json:"Bookname"`
	Author      string `json:"Author"`
	Booknumber  string `json:"Booknumber"`
	Bookconcern string `json:"Bookconcern"`
	Bookstatus  int    `json:"Bookstatus"`
	// User		*User `json:User`

}

func GetAll() ([]*Book, error) {
	var books []*Book
	dbObj := orm.NewOrm()
	_, err := dbObj.QueryTable("Book").All(&books)
	if err != nil {
		return nil, errors.New("Get ALL users error!")
	}
	return books, nil
}

func GetAllBooks(bookname string, pageindex int) ([]*Book, error) {

	dbObj := orm.NewOrm()
	var books []*Book
	num, err := dbObj.QueryTable("Book").Filter("Bookname__contains", bookname).Limit(20, pageindex*20).All(&books)
	if err != nil {
		return nil, err
	} else if num == 0 {
		return nil, nil
	}
	return books, nil

}

func GetAllBooksWithoutSearch(pageindex int) ([]*Book, error) {

	dbObj := orm.NewOrm()
	var books []*Book
	num, err := dbObj.QueryTable("Book").Limit(20, pageindex*20).All(&books)
	if err != nil {
		return nil, err
	} else if num == 0 {
		return nil, nil
	}
	return books, nil

}

func BorrowAndUpdateBookStatus(booknumber string) (int, error) {
	dbObj := orm.NewOrm()
	book := &Book{Booknumber: booknumber}

	// num, err := dbObj.Update(book)
	//0失败1成功2已经被借走
	err := dbObj.Read(book, "Booknumber")
	if err != nil {
		logs.Error(err.Error(), "\n")
		return 0, err
	} else {
		if book.Bookstatus == 1 {
			book.Bookstatus = 0
			num, err := dbObj.Update(book)
			if err != nil {
				logs.Error(err.Error(), "\n")
				return 0, err
			} else if num == 0 {
				//这种情况应该不会出现
				logs.Error("Update  book Not Exist!", "\n")
				return 2, errors.New("Update  book Not Exist!")
				// return nil
			}
			return 1, nil

		} else {
			return 2, nil
		}
	}

}

func BackAndUpdateBookStatus(booknumber string) (int, error) {
	dbObj := orm.NewOrm()

	book := &Book{Booknumber: booknumber}

	// num, err := dbObj.Update(book)
	//0失败1成功2已经归还
	err := dbObj.Read(book, "Booknumber")
	if err != nil {
		logs.Error(err.Error(), "\n")
		return 0, err
	} else {
		if book.Bookstatus == 0 {
			book.Bookstatus = 1
			num, err := dbObj.Update(book)
			if err != nil {
				logs.Error(err.Error(), "\n")
				return 0, err
			} else if num == 0 {
				//这种情况应该不会出现
				logs.Error("Update  book Not Exist!", "\n")
				return 2, errors.New("Update  book Not Exist!")
				// return nil
			}
			return 1, nil

		} else {
			return 2, nil
		}
	}

}

func AddBook(b *Book) error {
	dbObj := orm.NewOrm()

	_, err := dbObj.Insert(b)

	if err != nil {
		errms := fmt.Sprintf("insert book: Bookname=%s error! %s", b.Bookname, err)
		fmt.Printf(errms, "\n")
		return errors.New(errms)
	}

	return nil
}

func DeleteBook(ids []int) error {
	dbObj := orm.NewOrm()

	for _, bid := range ids {
		book := &Book{Id: bid}

		err := dbObj.Read(book)
		if err == orm.ErrNoRows {
			fmt.Println("查询不到")
		} else if err == orm.ErrMissPK {
			fmt.Println("找不到主键")
		} else {
			if book.Bookstatus == 0 {
				logs.Debug("该本书已被借走不能删除", book.Bookname)
				return errors.New("Book is already borrowed")
			}
			if num, err := dbObj.Delete(book); err != nil {
				return err
			} else if num == 0 {
				return errors.New("Book not exists")
			}
		}

	}
	return nil
}

func UpdateBook(b *Book) error {
	dbObj := orm.NewOrm()
	num, err := dbObj.Update(b)

	if err != nil {
		return err
	} else if num == 0 {
		logs.Info("no num update")
		return nil
	}

	return nil
}

func GetBook(id int) (b *Book, err error) {
	dbObj := orm.NewOrm()
	b = &Book{Id: id}
	err = dbObj.Read(b)

	if err != nil {
		return nil, errors.New("Book not exists")
	}
	return b, nil
}
