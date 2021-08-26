import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import Root from './Root';
import 'antd-mobile/dist/antd-mobile.css';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';
import axios from "axios";



axios.defaults.baseURL = "http://127.0.0.1:6070";
axios.defaults.timeout = 10000;
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么

    return response;
}, function (err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)'; break;
            case 401:
                // hashHistory.push("/");
                err.message = '未授权，请重新登录';
                break; 
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
    } else {
        err.message = '连接服务器失败!'
    }
    // message.error(err.message);
    return Promise.reject(err);
});


// axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // var token = localStorage.getItem('access_token');
    
        // config.headers['token'] = "token";
  
    
    // console.log(config);

//     return config;
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });
ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
