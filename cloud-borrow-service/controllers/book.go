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

type BookController struct {
	beego.Controller
}

type BookResource struct {
	Bookname    string
	Author      string
	Booknumber  string
	Bookconcern string
	Bookstatus  int
}

type DdeleteBook struct {
	bookids []int
}

func (b *BookController) GetAllByBookname() {
	// bookname := b.Ctx.Input.Param(":bookname")
	bookname := b.GetString("bookname")
	pageindex := b.GetString("pageindex")
	pageindexint, err := strconv.Atoi(pageindex)
	if err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.StrconvFailed)
		return
	}
	logs.Info("bookname", bookname)
	if bookname != "" {

		books, err := models.GetAllBooks(bookname,pageindexint)
		if err != nil {
			logs.Debug("GetAllBooks", err)
			httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.GetAllBookFiled)
			return
		}
		httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, books)

	} else {
		books, err := models.GetAllBooksWithoutSearch(pageindexint)
		if err != nil {
			logs.Debug("GetAllBooks", err)
			httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.GetAllBookFiled)
			return
		}
		httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, books)
	}

}

func (b *BookController) CreateBook() {

	var bookResource BookResource
	json.Unmarshal(b.Ctx.Input.RequestBody, &bookResource)

	book := &models.Book{
		Bookname:    bookResource.Bookname,
		Author:      bookResource.Author,
		Booknumber:  bookResource.Booknumber,
		Bookconcern: bookResource.Bookconcern,
		Bookstatus:  1,
	}

	if err := models.AddBook(book); err != nil {
		logs.Info(err.Error(), "Username = ", bookResource.Bookname)
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.CreateBookFailed)
		return
	}
	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusCreated, "Succeed!")
}

func (b *BookController) GetAll() {

	books, err := models.GetAll()
	if err != nil {
		logs.Info(err.Error())
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectAllBookFailed)
		return
	}

	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, books)
}

func (b *BookController) DeleteMuiltyBooks() {

	var delteBook DdeleteBook
	json.Unmarshal(b.Ctx.Input.RequestBody, &delteBook)
	logs.Info("DeleteMuiltyBooks.ids!!!", delteBook.bookids)

	ids := delteBook.bookids
	err := models.DeleteBook(ids)
	if err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.DeleteBookFailed)
		return
	}

	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, "Succeed!")
}

func (b *BookController) UpdateBook() {

	id, err := strconv.Atoi(b.Ctx.Input.Param(":id"))
	if err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.StrconvFailed)
		return
	}
	book, err := models.GetBook(id)
	if err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectBookByIDFailed)
		return
	}
	var bookResource BookResource
	json.Unmarshal(b.Ctx.Input.RequestBody, &bookResource)

	if bookResource.Bookname != "" {
		book.Bookname = bookResource.Bookname
	}
	if bookResource.Author != "" {
		book.Author = bookResource.Booknumber
	}
	if bookResource.Booknumber != "" {
		book.Booknumber = bookResource.Booknumber
	}

	if bookResource.Bookconcern != "" {
		book.Bookconcern = bookResource.Bookconcern
	}

	if err := models.UpdateBook(book); err != nil {
		logs.Error(err.Error())
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.UpdateBookFailed)
		return
	}

	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, "Succeed!")

}
