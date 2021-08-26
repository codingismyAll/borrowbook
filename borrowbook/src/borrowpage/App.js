import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Toast, List, InputItem, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { hashHistory } from 'react-router';
const alert = Modal.alert;


function successToast() {
  Toast.success('借阅成功! 阅读完请及时归还', 3);

}
let booknumber;
let bookname;

class App extends Component {
  // handleClick = () => {
  //   this.inputRef.focus();

  // }

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      depart: "",
      usernumber: ""
    }

  }


  componentWillMount() {
    booknumber = this.props.location.state.booknumber;
    bookname = this.props.location.state.bookname;
    console.log(booknumber, bookname);
  }

  confirmSubmit = () => {


    // this.props.form.validateFields((err, values) => {
    //   if(err !== null){
    //     alert(err);
    //     return;
    //   }
    //   this.borrowBook(values)
    //   console.log(values,err)

    // })

    this.borrowBook();

  }


  borrowBook = () => {
    const { username, usernumber } = this.state;
    if (username === "" || usernumber === "") {
      alert("请输入个人信息");
      return;
    }
    axios.post('/borrowservice/borrowbook', {
      Username: username,
      Usernumber: usernumber,
      Booknumber: booknumber

    }).then(res => {

      // this.setState({ bookdata: res.data })
      if (res.data.Code === "014" || res.data.Code === "015") {
        alert("员工编号或用户名错误");
        return
      }

      if (res.data.Code === "016" || res.data.Code === "018"){
        alert("借书失败")
        return
      }

      if (res.data.Code === "017"){
        alert("抱歉，书已经被借走！")
        return
      }

      successToast();


      setTimeout(() => {
        localStorage.setItem('goback', "goback");
        hashHistory.goBack()
        // hashHistory.goBack()
        // this.context.router.history.push("/")
      }, 2000)

    }).catch(error => {
      console.log(error)
    })


  }

  writeName = (e) => {
    this.setState({
      username: e
    })
  }


  writeDepart = (e) => {
    this.setState({
      depart: e
    })
  }

  writeUsernumber = (e) => {
    this.setState({
      usernumber: e
    })

  }

  requestName = () => {
    console.log(this.state.usernumber)


    axios.get('/borrowservice/getuser?usernumber=' + this.state.usernumber).then(res => {


      if (res.data == null) {
        // alert("")
        // this.setState({
        //   username:res.data.Username,
        //   depart: res.data.Department
        // })
        return
      }
      if(res.data.Code === "014"){
        alert("获取姓名失败");
        return
      }



      // this.setState({ bookdata: res.data })

      this.setState({
        username: res.data.Username,
        depart: res.data.Department
      })

      console.log(res.data)
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <List renderHeader={() => '请输入个人信息:（' + bookname + '）'}>
          <InputItem
            {...getFieldProps('Usernumber')}
            clear
            placeholder="usernumber"
            // ref={el => this.inputRef = el}
            onBlur={this.requestName}
            value={this.state.usernumber}
            onChange={this.writeUsernumber}
          >员工编号</InputItem>
          {/* 输入员工证编号自动跳出姓名和部门 */}
          <InputItem
            {...getFieldProps('Username')}
            clear
            placeholder="username"
            // ref={el => this.autoFocusInst = el}
            value={this.state.username}
            onChange={this.writeName}
          >姓名</InputItem>

          <InputItem
            {...getFieldProps('Department')}
            clear
            placeholder="department"
            ref={el => this.inputRef = el}
            value={this.state.depart}
            onChange={this.writeDepart}
          >部门</InputItem>
          <List.Item>
            <div
              style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
              onClick={() =>
                alert('确认提交', '已确认拿到实物书籍???', [
                  { text: '取消', onPress: () => console.log('cancel') },
                  { text: '确认', onPress: () => this.confirmSubmit() },
                ])
              }
            >
              确认提交
            </div>
          </List.Item>
          {/* <WhiteSpace /> */}


        </List>

        {/* <Button type="primary" inline size="small" style={{ marginRight: '4px' }}>确认提交</Button> */}

      </div>
    );
  }
}
App.contextTypes = { router: PropTypes.object.isRequired };
const BorrowPage = createForm()(App);

export default BorrowPage;
