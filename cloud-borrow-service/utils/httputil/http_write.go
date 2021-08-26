package httputil

import (
	"cloud-borrow-service/utils/errorutil"
	"encoding/json"
	"net/http"
	// "strconv"
)

type ErrorResponse struct {
	Message string
	Module  string
	Code    string
}
type SuccessResponse struct {
	Message     string
	Module      string
	Code        string
	Token       string
	Permission  int
	Companyname string
}
type DeviceSuccessResoponse struct {
	Message string
	Module  string
	Code    string
	UUId    string
}

// WriteJSON writes the value v to the http response stream as json with standard json encoding.
func WriteLoginJSON(w http.ResponseWriter, httpcode int, v string, permission int, companyname string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpcode)

	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	// if err := enc.Encode(v); err != nil {
	// 	WriteERROR(w, httpcode, err, errorutil.JsonTransformFailed)
	// }
	successRes := SuccessResponse{
		Message: "login success！",
		Module:  "cloud-website-service",
		// Code:    strconv.Itoa(httpcode) + ecode,
		Code:        "000",
		Token:       v,
		Permission:  permission,
		Companyname: companyname,
	}
	enc.Encode(successRes)
}

func WriteDeviceJSON(w http.ResponseWriter, httpcode int, v string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpcode)

	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	// if err := enc.Encode(v); err != nil {
	// 	WriteERROR(w, httpcode, err, errorutil.JsonTransformFailed)
	// }
	successRes := DeviceSuccessResoponse{
		Message: "add device success！",
		Module:  "cloud-website-service",
		// Code:    strconv.Itoa(httpcode) + ecode,
		Code: "000",
		UUId: v,
	}
	enc.Encode(successRes)
}

func WriteJSON(w http.ResponseWriter, httpcode int, v interface{}) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpcode)

	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	if err := enc.Encode(v); err != nil {
		WriteERROR(w, httpcode, err, errorutil.JsonTransformFailed)
	}
}

func WriteERROR(w http.ResponseWriter, httpcode int, err error, ecode string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpcode)
	var errm string
	if err != nil {
		errm = err.Error()
	} else {
		errm = ""
	}
	errEr := ErrorResponse{
		Message: errm,
		Module:  "cloud-borrow-service",
		// Code:    strconv.Itoa(httpcode) + ecode,
		Code: ecode,
	}

	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	enc.Encode(errEr)
}
