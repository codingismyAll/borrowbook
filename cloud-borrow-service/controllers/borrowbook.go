package controllers

import (
	"cloud-borrow-service/models"
	"cloud-borrow-service/utils/errorutil"
	"cloud-borrow-service/utils/httputil"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
)

type BorrowController struct {
	beego.Controller
}

type PersonInformation struct {
	Username   string
	Usernumber string
	Booknumber string
}
type BoPersonInfo struct {
	Usernumber string
	Booknumber []string
}

var lock sync.Mutex
var cstZone = time.FixedZone("CST", 8*3600)

func (b *BorrowController) BorrowBook() {

	var personInfo PersonInformation
	json.Unmarshal(b.Ctx.Input.RequestBody, &personInfo)
	//判断人名和编号是否一致
	uname, err := models.GetUsername(personInfo.Usernumber)
	if err != nil {
		logs.Debug("GetUsernumber", err)
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectUsernumberFailed)
		return
	}
	if uname != personInfo.Username {
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.UsernameNotRight)
		return
	}

	//这里还需要判断这本书是不是还有

	//1代表有 0代表无

	// 东八
	logs.Info(time.Now().In(cstZone).Format("2006-01-02 15:04:05"))

	bo := &models.BorrowInformation{
		Usernumber:   personInfo.Usernumber,
		Booknumber:   personInfo.Booknumber,
		Borrowstatus: 1,
		Createtime:   time.Now().In(cstZone).Format("2006-01-02 15:04:05"),
	}
	// getbo, err := models.GetBorrowInfoByBookbumber(personInfo.Booknumber)
	// if err != nil {
	// 	logs.Debug("getbo", getbo)
	// } else {
	// 	if getbo.Borrowstatus == 1 {
	// 		//这本书已经被借走
	// 		httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, errorutil.SelectAllUserFailed)
	// 		return
	// 	}
	// }
	lock.Lock()
	result, err := models.BorrowAndUpdateBookStatus(personInfo.Booknumber)
	logs.Debug("result", result)

	if err != nil {
		logs.Debug("BorrowAndUpdateBookStatus", err)
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.BorrowAndUpdateBookStatusFailed)
		return
	}

	if result == 2 {
		logs.Debug(personInfo.Booknumber, "该本书已经被借走")
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.BookAlreadyBorrowed)
		return
	}

	if err := models.AddBorrowInformation(bo); err != nil {
		logs.Debug("AddBorrowInformation", err)
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.AddBorrowInfoFailed)
		return
	}
	lock.Unlock()

	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusCreated, "Succeed!")
}

//这个接口需要改成多本书的情况
func (b *BorrowController) GiveBackBook() {

	var personInfo BoPersonInfo
	json.Unmarshal(b.Ctx.Input.RequestBody, &personInfo)

	if len(personInfo.Booknumber) == 0 {
		logs.Debug("book数量为0")
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, nil, errorutil.BooknumberIsZero)
		return
	}
	boslice, err := models.GetBorrowInfoByBookbumber(personInfo.Booknumber, personInfo.Usernumber)
	if err != nil {
		logs.Debug("GetBorrowInfoByBookbumber", err)
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectBorrowByNumberFailed)
		return
	}
	// if bo.Borrowstatus == 0 {
	// 	logs.Debug(bo.Borrowstatus, "该本书已经归还")
	// 	httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.BookAlreadyBack)
	// 	return
	// }

	//更新book表结构
	for _, item := range personInfo.Booknumber {

		result, err := models.BackAndUpdateBookStatus(item)
		logs.Debug("result", result)

		if err != nil {
			logs.Debug("BackAndUpdateBookStatus", err)
			httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.BackUpdateBookStatusFailed)
			return
		}
		if result == 2 {
			logs.Debug(item, result, "该本书已经归还")
			httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.BookAlreadyBack)
			return
		}

	}

	for _, bo := range boslice {

		logs.Debug("bo", bo)
		bo.Borrowstatus = 0
		bo.Backtime = time.Now().In(cstZone).Format("2006-01-02 15:04:05")
		if err := models.UpdateBorrowInformation(bo); err != nil {
			logs.Debug("UpdateBorrowInformation", err)
			httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.UpdateBorrowInformationFailed)
			return
		}

	}

	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusCreated, "Succeed!")

}

//查询借书记录接口
func (b *BorrowController) GetBookByPerson() {

	// Usernumber := b.Ctx.Input.Param(":Usernumber")

	Usernumber := b.GetString("usernumber")
	books, err := models.GetBookByPerson(Usernumber)

	if err != nil {
		logs.Debug("GetBookByPerson", err)
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectBookRecordFailed)
		return
	}
	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, books)

}
func (b *BorrowController) GetBorrowInfoByBook() {
	Booknumber := b.GetString("booknumber")
	borrowInfo, err := models.GetPersonByBook(Booknumber)
	if err != nil {
		logs.Debug("GetPersonByBook", err)
		httputil.WriteERROR(b.Ctx.ResponseWriter, http.StatusOK, err, errorutil.SelectBookRecordFailed)
		return
	}
	httputil.WriteJSON(b.Ctx.ResponseWriter, http.StatusOK, borrowInfo)
}
