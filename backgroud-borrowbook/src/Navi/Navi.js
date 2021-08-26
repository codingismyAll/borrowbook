import React, { Component } from 'react';
import {  Layout, Menu, Icon, Modal } from 'antd';
import { Link } from 'react-router';
import 'antd/dist/antd.css';
import './Navi.css';
import axios from "axios";
import { hashHistory } from 'react-router';


const { Header, Content, Footer, Sider } = Layout;


const confirm = Modal.confirm;

const logout = () => {
    confirm({
        title: '退出登录',
        content: '您确定需要退出登录吗？',
        onOk() {
            axios.post('/v1/logout').then(res => {
                localStorage.removeItem('access_token');
                // console.log(localStorage.getItem('access_token'));
            }).catch(error => {
                localStorage.removeItem('access_token');
                // console.log(localStorage.getItem('access_token'));
                console.log(error);
            });
            
    

            hashHistory.push("/");
        },
        onCancel() { },
    });
}




class SiderDemo extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        current: localStorage.getItem("currentKey") ? localStorage.getItem("currentKey") : '1',
        menuList: [
            {
                "key": "1",
                "url": "/person",
                "name": "人员管理",
                "icon": "team"
            },
            {
                "key": "2",
                "url": "/bookmanager",
                "name": "图书管理",
                "icon": "book"
            },
            {
                "key": "3",
                "url": "/bookbackup",
                "name": "图书归还",
                "icon": "diff"
            }
        ]
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    componentWillMount() {
 
        //正则表达式的匹配
        var regex = /[123]$/;
        this.state.menuList = this.state.menuList.filter(item => regex.test(item.key))

    }


    componentDidMount() {

    }



    handleClick = (e) => {
        localStorage.setItem('currentKey', e.key);

        this.setState({
            current: e.key,
        });
    }


    render() {
        const { children } = this.props;
        const {  collapsed } = this.state;
        return (
            <Layout>
                <Sider style={{ overflow: 'auto', position: 'fixed', height: '100%' }} trigger={null} collapsible collapsed={collapsed}>
                    <div className="logo" >SUPCON</div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}>
                
                        {
                            this.state.menuList.map((e) =>
                                <Menu.Item key={e.key}>
                                    <Link to={{ pathname: e.url }}>
                                        <Icon type={e.icon}></Icon>
                                        <span className="nav-text">{e.name}</span>
                                    </Link>
                                </Menu.Item>
                            )
                        }

                    </Menu>
                </Sider>
                <Layout style={collapsed === false ? { marginLeft: 200 } : { marginLeft: 100 }}>
                    <Header className="header">
                        <span style={{ color: '#fff', paddingLeft: '2%', fontSize: '1.4em' }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                                style={{ cursor: 'pointer' }}
                            />
                        </span>
                        <span onClick={logout} style={{ color: '#fff', float: 'right', paddingRight: '1%' }}>
                            {/*<img src={logo} className="App-logo" alt="logo" /> */}

                            <span style={{ color: '#fff', fontSize: '1.2em' }}> <Icon type="poweroff" /> </span>
                            <span style={{ color: '#fff', paddingRight: '38%', fontSize: '1.2em' }}> 注销 </span>
                        </span>
                        <span style={{ marginRight: "35px", color: '#fff', float: 'right', fontSize: '1.2em' }}>{localStorage.getItem("Companyname") === "" ? "系统管理员" : localStorage.getItem("Companyname")}</span>

                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        {children}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <a href="">帮助</a>
                        <a href="">隐私</a>
                        <a href="">条款</a><br />
                        copyright©2019SUPCON图书管理平台
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default SiderDemo;





