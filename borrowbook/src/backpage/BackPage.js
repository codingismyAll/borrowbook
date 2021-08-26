import React, { Component } from 'react';
import { Affix } from 'antd';
// import logo from './logo.svg';
import { Toast, SearchBar, List, Checkbox, Modal, Button } from 'antd-mobile';
import axios from 'axios';
import '../Mock/mock';
import { PropTypes } from 'prop-types';
import { hashHistory } from 'react-router';

const Item = List.Item;
const Brief = Item.Brief;
const CheckboxItem = Checkbox.CheckboxItem;
const alert = Modal.alert;

function successToast() {
    Toast.success('归还成功!', 3);

}


class BackPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            borrowBookdata: [],
            // bottom: 5,
            dispalyAffix: "none",
            checked: false,
            checkstate: [],
            employnumber: ""
        }
    }

    gotoBorrowPage = () => {
        // this.context.router.push('/borrowpage');
    }

    handleClick = (value) => {
        console.log(value);
        if (value === "") {
            alert("请填写员工证编号")
            return;
        }
        this.setState({
            employnumber: value
        })

        axios.get('/borrowservice/getborrowrecord?usernumber=' + value).then(res => {

       
            if (res.data == null) {
                alert("无借书记录")
                this.setState({ borrowBookdata: [], dispalyAffix: "none" })
                return;
            }

            if (res.data.Code === "023"){
                alert("查询失败")
                return
            }
            this.setState({ dispalyAffix: "block" })
            for (let i = 0; i < res.data.length; i++) {

                this.state.checkstate[i] = false;
            }
            this.setState({ borrowBookdata: res.data })

        }).catch(error => {
            console.log(error)
        })

    }
    checkedAll = () => {



        this.setState({
            checked: !this.state.checked
        })



        if (!this.state.checked) {
            for (let i = 0; i < this.state.checkstate.length; i++) {

                this.state.checkstate[i] = true;
            }
            let tempstateArr = this.state.checkstate;
            this.setState({ checkstate: tempstateArr })
        } else {
            for (let i = 0; i < this.state.checkstate.length; i++) {

                this.state.checkstate[i] = false;
            }
            let tempstateArr = this.state.checkstate;
            this.setState({ checkstate: tempstateArr })
        }
    }
    checkbox = (e, id, index) => {

        this.state.checkstate[index] = !this.state.checkstate[index];

        let tempstateArr = this.state.checkstate;

        let allchecked = tempstateArr.indexOf(false) > -1 ? false : true

        this.setState({
            checkstate: tempstateArr
        })

        if (allchecked) {
            this.setState({
                checked: true
            })
        } else {
            let mychecked = this.state.checked;
            if (mychecked) {
                this.setState({
                    checked: false
                })
            }
        }

        console.log(e, id);
        // console.log(document.getElementById(e).style.checked)
    }


    backpage = () => {

        console.log("backpage");
        const { borrowBookdata, checkstate, employnumber } = this.state;

        let booknumber = [];
        checkstate.map((item, index) => {
            if (item) {
                booknumber.push(borrowBookdata[index].Booknumber);
            }
        })


        if (booknumber.length === 0){
            alert("请勾选所还书籍");
            return;
        }

        axios.post('/borrowservice/givebackbook', {
            Usernumber: employnumber,
            Booknumber: booknumber

        }).then(res => {


            
 
            if (res.data === "Succeed!") {
                // alert("归还成功")

                successToast();

                setTimeout(() => {
                    // this.context.router.push('/')
                    hashHistory.goBack()
                }, 3000)

            }else if(res.data.Code === "024"){
                alert("请勾选所还书籍");
                return
            }else if(res.data.Code === "019" || res.data.Code === "021" || res.data.Code === "022"){
                alert("还书失败!")
                return
            }



        }).catch(error => {
            console.log(error)
            // alert("");
            
        })


        console.log(booknumber, "employnumber", employnumber)



    }
    render() {

        const newList = data => data.map((item, index) => {

            console.log(this.state.checkstate[index])
            return <CheckboxItem checked={this.state.checkstate[index]} id={item.Booknumber} key={item.Booknumber} extra={item.Booknumber} multipleLine onChange={(e) => this.checkbox(e, item.Booknumber, index)}>{item.Bookname}
                <Brief>{item.Author}</Brief>
            </CheckboxItem>

        })
        const { borrowBookdata, dispalyAffix } = this.state;

        return (
            <div>
                <SearchBar placeholder="输入员工证编号进行查询" maxLength={8} onSubmit={(value) => this.handleClick(value)} />
                <List>
                    {newList(borrowBookdata)}

                </List>


                <div style={{zIndex:100,position:"fixed",bottom:0,width:"100%",display:dispalyAffix}}>
                    <CheckboxItem style={{ float: "left", width: "70%" }} checked={this.state.checked} onClick={() => this.checkedAll()}>全选 </CheckboxItem>


                    <Button style={{ float: "left", width: "25%",position: "static",marginTop: "6px" }} type="primary" size="small" onClick={() =>
                        alert('确认归还', '请您归还至图书室，谢谢！', [
                            { text: '取消', onPress: () => console.log("cancel") },
                            { text: '确认', onPress: () => this.backpage() },
                        ])
                    }>归还</Button>
                </div>



            </div>
        );
    }
}
BackPage.contextTypes = { router: PropTypes.object.isRequired };
export default BackPage;
