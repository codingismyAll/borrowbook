import { Table, Button, Modal, Form, Menu, Dropdown, Select, Input, Icon, Breadcrumb, Layout, Spin, message } from 'antd';
import React from 'react';

import axios from "axios";
const { Content } = Layout;
const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 16
  }
};



let constbookData = [];
let modalName = "";
let bookIdArr = [];


class BookBackPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookData: [],
      confirmLoading: true
    };

    this.receBook = {};
  }

  state = { bookModal: true, transparent: true, deleteModal: true }


  componentDidMount() {
    this.requestAllBook();
    window.scrollTo(0, 0);
  }

  //添加用户或者编辑用户的Modal
  showModal = (borrowInfo) => {
    axios.get('/borrowservice/confirmback?borrowid='+borrowInfo.Id).then(res => {
      if (res.data === "Succeed!"){
        message.success('确认归还成功！');
        this.requestAllBook();
      }else{
        message.error('确认归还失败！');
      }
     
    }).catch(function (error) {
      console.dir(error);
    })
  }

  requestAllBook = () => {
    axios.get('/borrowservice/getallgonfirmback').then(res => {

      this.setState({ bookData: res.data, tableLoading: false });
      constbookData = res.data;

    }).catch(function (error) {
      console.dir(error);
    })
  }



  getSearchData(value) {

    const { bookData } = this.state;
    this.setState({
      bookData: constbookData.filter(item => (item.Bookname.indexOf(value) > -1))
    })
  }

  render() {
    // const { personalManage } = this.state;
    // 用这句注释删除的时候是全部删除而不是一列一列删除
    // const showData = this.state.bookData.filter(item => item.isShow);
    // this.state.bookData = this.state.bookData.filter(item => item.isShow);
    const menu = <Menu>
      <Menu.Item>
        <a target="_blank">确认归还</a>
      </Menu.Item>
    </Menu>;



    const Search = Input.Search;

    const columns = [
      {
        title: '书名',
        dataIndex: 'Bookname',
        key: 'Bookname'
      },
      {
        title: '图书编号',
        dataIndex: 'Booknumber',
        key: 'Booknumber'
      },
      {
        title: '借阅人',
        dataIndex: 'Username',
        key: 'Username'
      },
      {
        title: '借阅人编号',
        dataIndex: 'Usernumber',
        key: 'Usernumber'
      },
      {
        title: '借阅时间',
        dataIndex: 'Createtime',
        key: 'Createtime'
      },
      {
        title: '归还时间',
        dataIndex: 'Backtime',
        key: 'Backtime'
      },

      {
        render: (text, record) => {

          return (
            <div>
              {record.Back ? (<p style={{ color: "red" }}>已确认</p>) : (<Dropdown overlay={menu}>
                <Button className="allbtn" onClick={() => this.showModal(record)}><Icon type="check" /></Button>
              </Dropdown>)}

            </div>
          );
        }
      }
    ];

    
    //分页
    const pagination = {
      total: this.state.bookData.length,
      // showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 8,
      pageSize: 8
    };



    return (

      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>人员管理</Breadcrumb.Item>
        </Breadcrumb>


        <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>


          <Search
            placeholder="请输入书名查询"
            onSearch={value => this.getSearchData(value)}
            style={{ width: 300, float: 'right' }}
            enterButton
          />
          <br /><br />

          <Spin size="large" spinning={this.state.tableLoading} >
            <Table showHeader={true}  columns={columns} dataSource={this.state.bookData} rowKey={row => row.Id} pagination={pagination} />
          </Spin>
        </div>
      </Content>
    );
  }
}

// PersonalManage.contextTypes = { router: PropTypes.object.isRequired };
BookBackPage = Form.create()(BookBackPage);
export default BookBackPage;