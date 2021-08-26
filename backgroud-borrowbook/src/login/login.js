import React from 'react'
import 'antd/dist/antd.css';
// import { post } from '../utils/request';
// import style from './login.css';
import './login.css';
// import { PropTypes } from 'prop-types';
import axios from "axios";
import { PropTypes } from 'prop-types';
import { message } from 'antd';
// import { browserHistory } from 'react-router';




class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            userName: '',
            password: '',
            errorInfo: ''

        }
    }
    formsubmit = () => {
        const {userName,password} = this.state;
        if (userName=="admin"&&password =="admin"){
            message.success("登录成功")
            localStorage.removeItem('currentKey');
            this.context.router.push('/person');
        }else{
            message.error("用户名或密码错误")
        }
     
    }



    keypress = (e) => {
        console.log("响应了键盘")
        if (e.which !== 13) return
        this.formsubmit();
    }
    onChangeUserName = (e) => {
        console.log(e.target.value);
        this.setState({
            userName: e.target.value
        })
    }
    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }




    render() {
        const { userName } = this.state;
        const { password } = this.state;
        const { errorInfo } = this.state;
        return (

            <div className="block">
                <div className="logButton">
                    <div className="logButton2">
                        <div className="logButton3">用户登录</div>
                        <table style={{ position: "relative" }}>
                            <tbody>
                                <tr className="logButton4">
                                    <td className="logButton5"></td>
                                    <td>
                                        <input type="text" className="logButton6" onKeyPress={this.keypress} required={true} value={userName} onChange={this.onChangeUserName} placeholder="请输入账号" />
                                    </td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr className="logButton7">
                                    <td className="logButton8"></td>
                                    <td><input type="password" className="logButton9" onKeyPress={this.keypress} required={true} value={password} onChange={this.onChangePassword} placeholder="请输入密码" /></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr className="logButton10" >
                                    <td> <input type="button" className="logButton11" onClick={() => this.formsubmit()} /></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr className="logButton12" >
                                    <td className="logButton13" ><span style={{ color: "#DF2525" }}>{errorInfo}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


                {/*<div style={{ textAlign: 'center', background: 'rgb(195, 215, 236) ' }}>
                        <a href="">帮助 </a>
                        <a href="">隐私 </a>
                        <a href="">条款</a><br />
                        copyright©浙江中控技术公司

                    </div>*/}
            </div>
        );
    }
}




Login.contextTypes = { router: PropTypes.object.isRequired };

export default Login;
