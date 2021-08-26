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


class BookManage extends React.Component {

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
  showModal = (person) => {
    if (person != null) {
      modalName = "编辑";
      this.receBook = person;
    } else {
      modalName = "添加";
      this.receBook = {}
    }
    this.setState({
      bookModal: true,
    });
  }

  addBook = (bookModalValue) => {
    axios.post('/borrowservice/book', {
      Bookname: bookModalValue.Bookname,
      Author: bookModalValue.Author,
      Booknumber: bookModalValue.Booknumber,
      Bookconcern: bookModalValue.Bookconcern
    }).then(res => {
      if (res.data.Code === "002") {
        message.error("用户名已存在");
        this.setState({
          confirmLoading: false
        })
      } else if (res.data.Code === "003" || res.data.Code === "005" || res.data.Code === "007") {
        message.error("创建用户失败");
        this.setState({
          confirmLoading: false
        })
      } else {
        this.setState({
          bookModal: false,
          confirmLoading: false
        })
        message.success("添加书籍成功")
        this.requestAllBook();
      }
    }).catch(error => {
      console.log(error);
      this.setState({
        confirmLoading: false
      })
    });
  }

  updateBook = (bookModalValue) => {

    if (this.receBook === null) {
      return;
    }
    axios.put('/borrowservice/book/' + this.receBook.Id, {
      Bookname: bookModalValue.Bookname,
      Booknumber: bookModalValue.Booknumber,
      Bookconcern: bookModalValue.Bookconcern,
      Author: bookModalValue.Author
    }).then(res => {

      if (res.data.Code === "044") {
        message.error("用户名已存在");
        this.setState({
          confirmLoading: false
        })
      } else if (res.data.Code === "008" || res.data.Code === "005" || res.data.Code === "007") {
        message.error("创建用户失败");
        this.setState({
          confirmLoading: false
        })
      } else {
        this.setState({
          bookModal: false,
          confirmLoading: false
        })
        message.success("更新书籍成功")
        this.requestAllBook();
      }
    }).catch(error => {
      console.log(error);
      this.setState({
        confirmLoading: false
      })
    });
  }

  handleOk = (e) => {

    this.props.form.validateFields((err, bookModalValue) => {

      if (err == null) {
        if (bookModalValue.Bookname === undefined || bookModalValue.Booknumber === undefined ) {
          message.error("书名或图书编号不能为空");
          this.setState({
            confirmLoading: false
          })
          return;
        }

        if (modalName === "添加") {
          this.addBook(bookModalValue);
        } else {
          this.updateBook(bookModalValue);
        }
      } else {
        this.setState({
          // editModal: false,
          confirmLoading: false
        })
      }


    })
  }

  showDeleteModal = (person) => {
    this.setState({
      deleteModal: true
    });
  }


  requestAllBook = () => {
    axios.get('/borrowservice/book').then(res => {
      if (res.data.Code === "007" || res.data.Code === "004") {
        message.error("获取管理员失败")
      } else {
        this.setState({ bookData: res.data, tableLoading: false });
        constbookData = res.data;
      }
    }).catch(function (error) {
      console.dir(error);
    })
  }

  deleteBook = (value) => {
    if (value.length === 0) {
      message.warn("请选择书籍进行删除！")
      return;
    }
    axios.post('/borrowservice/deletebook', {
      bookids: value
    }).then(res => {
      if (res.data.Code === "009") {
        message.warn(res.data.Message)
      } else if (res.data.Code === "007") {
        message.warn("删除书籍失败")
      } else {
        this.setState({
          deleteModal: false,
        })
        message.success("删除书籍成功！")
        this.requestAllBook();
      }
    }).catch(err => {
      console.log(err);

    });
  }

  handleDeleteOk = () => {
    // this.state.selectedRows.forEach(item => item.isShow = false);
    this.deleteBook(bookIdArr)
    // this.setState({
    //   deleteModal: false
    // });

  }


  handleCancel = (e) => {
    this.setState({
      bookModal: false,
      deleteModal: false,

    });

  }

  // getSearchData = (value) =>{
  //   console.log(value);
  // }
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
        <a target="_blank">图书编辑</a>
      </Menu.Item>
    </Menu>;


    const { form } = this.props;
    const { getFieldDecorator } = form;
    const Search = Input.Search;

    const columns = [
      {
        title: '书名',
        dataIndex: 'Bookname',
        key: 'Bookname'
      },
      {
        title: '作者',
        dataIndex: 'Author',
        key: 'Author'
      },
      {
        title: '图书编号',
        dataIndex: 'Booknumber',
        key: 'Booknumber'
      },
      {
        title: '出版社',
        dataIndex: 'Bookconcern',
        key: 'Bookconcern'
      },
      {
        render: (text, record) => {

          return (
            <div>
              {record.Bookstatus === 0 ? (<p style={{ color: "red" }}>已借</p>) : (<div></div>)}
              <Dropdown overlay={menu}>
                <Button className="allbtn" onClick={() => this.showModal(record)}><Icon type="edit" /></Button>
              </Dropdown>



            </div>
          );
        }
      }
    ];

    //复选框
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //这句命令把数据存到状态中，然后需要实用的话再从状态中去取出数据即可。
        this.setState({ selectedRows });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
      onSelect: (record, selected, selectedRows) => {
        // console.log(record, selected, selectedRows);
        bookIdArr = [];
        for (var book of selectedRows) {
          bookIdArr.push(book.Id);
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        // console.log(selected, selectedRows, changeRows);
        bookIdArr = [];
        for (var book of selectedRows) {
          bookIdArr.push(book.Id);
        }
      },
    };
    //分页
    const pagination = {
      total: this.state.bookData.length,
      // showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 8,
      pageSize: 8
    };

    const Option = Select.Option;
    let children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    function handleChange(value) {
      console.log(`selected ${value}`);
    }


    return (

      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>人员管理</Breadcrumb.Item>
        </Breadcrumb>

        {this.state.bookModal && <Modal
          title={modalName}
          visible={this.state.bookModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          transparent={true}
          okText="确认"
          cancelText="取消"
        /*key={this.state.key}*/
        >
          <section>
            <Form>
              <FormItem label="书名：" {...formLayout}>
                {getFieldDecorator('Bookname', {
                  initialValue: this.receBook.Bookname,
                  rules: [
                    {
                      type: 'string',
                      required: true
                    }
                  ]
                })(
                  <Input type="text" placeholder="请输入书名" />
                )}
              </FormItem>

              <FormItem label="图书编号：" {...formLayout}>
                {getFieldDecorator('Booknumber', {
                  initialValue: this.receBook.Booknumber,
                  rules: [
                    {
                      type: 'string',
                      required: true
                    }
                  ]
                })(
                  <Input placeholder="请输入图书编号" />
                )}
              </FormItem>

              <FormItem label="作者：" {...formLayout}>
                {getFieldDecorator('Author', {
                  initialValue: this.receBook.Author,
                  rules: [
                    {
                      type: 'string',
                      // required: true
                    }
                  ]
                })(
                  <Input placeholder="请输入作者名称" />
                )}
              </FormItem>

              <FormItem label="出版社：" {...formLayout}>
                {getFieldDecorator('Bookconcern', {
                  initialValue: this.receBook.Bookconcern,
                  rules: [
                    {
                      type: 'string',
                      // required: true
                    }
                  ]
                })(
                  <Input placeholder="请输入出版社名称" />
                )}
              </FormItem>

            </Form>
          </section>
        </Modal>}


        <Modal
          title="删除人员"
          visible={this.state.deleteModal}
          onOk={this.handleDeleteOk}
          onCancel={this.handleCancel}

        >
          <p style={{ color: '#000000', fontSize: '1.2em' }}>确认删除当前选中书籍</p>

        </Modal>



        <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>

          <Button style={{ marginLeft: 2 }} type="primary" onClick={() => this.showModal()}>添加</Button>
          <Button style={{ marginLeft: 5 }} type="danger" onClick={() => this.showDeleteModal()}>删除</Button>

          <Search
            placeholder="请输入书名查询"
            onSearch={value => this.getSearchData(value)}
            style={{ width: 300, float: 'right' }}
            enterButton
          />
          <br /><br />
          {/*<Input type="search" placeholder="请输入" style={{ width: '300px', float: 'right' }}></Input><br /><br /><br />*/}
          {/* <Button className="addspan" onClick={() => this.showModal()}>+添加</Button><br /><br /><br /> */}
          <Spin size="large" spinning={this.state.tableLoading} >
            <Table showHeader={true} rowSelection={rowSelection} columns={columns} dataSource={this.state.bookData} rowKey={row => row.Id} pagination={pagination} />
          </Spin>
        </div>
      </Content>
    );
  }
}

// PersonalManage.contextTypes = { router: PropTypes.object.isRequired };
BookManage = Form.create()(BookManage);
export default BookManage;