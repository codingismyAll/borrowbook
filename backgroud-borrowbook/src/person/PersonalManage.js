import { message, Table, Button, Modal, Form, Menu, Dropdown, Select, Input, Icon, Breadcrumb, Layout, Spin } from 'antd';
import React from 'react';
import { PropTypes } from 'prop-types';
import 'antd/dist/antd.css';
import './PersonalManage.css';
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

let constUserData = [];
let modalName = "";
let userIdArr = [];

class PersonalManage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      personData: [],
      equipPermission: [],
      test: true,
      confirmLoading: true
    };

    this.recePerson = {};
  }

  state = { test: true, userModal: true, transparent: true, deleteModal: true }


  componentDidMount(){
    this.requestAllUser();
    window.scrollTo(0,0);
  }

  //添加用户或者编辑用户的Modal
  showModal = (person) => {
    if (person != null) {
      modalName = "编辑";
      this.recePerson = person;
    } else {
      modalName = "添加";
      this.recePerson = {}
    }
    this.setState({
      userModal: true,
    });
  }

  addUser = (userModalValue) => {
    axios.post('/borrowservice/user', {
      Username: userModalValue.Username,
      Usernumber: userModalValue.Usernumber,
      Department: userModalValue.Department
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
          userModal: false,
          confirmLoading: false
        })
        message.success("添加用户成功")
        this.requestAllUser();
      }
    }).catch(error => {
      console.log(error);
      this.setState({
        confirmLoading: false
      })
    });
  }

  updateUser = (userModalValue) => {

    if (this.recePerson === null) {
      return;
    }
    axios.put('/borrowservice/user/' + this.recePerson.Id, {
      Username: userModalValue.Username,
      Usernumber: userModalValue.Usernumber,
      Department: userModalValue.Department
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
          userModal: false,
          confirmLoading: false
        })
        message.success("更新用户成功")
        this.requestAllUser();
      }
    }).catch(error => {
      console.log(error);
      this.setState({
        confirmLoading: false
      })
    });
  }

  handleOk = (e) => {

    this.props.form.validateFields((err, userModalValue) => {

      if (err == null) {
        if (userModalValue.Username === undefined || userModalValue.Department === undefined || userModalValue.Usernumber === undefined) {
          message.error("姓名或部门或ID不能为空");
          this.setState({
            confirmLoading: false
          })
          return;
        }
       
        if (modalName === "添加") {
          this.addUser(userModalValue);
        } else {
          this.updateUser(userModalValue);
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


  requestAllUser = () => {
    axios.get('/borrowservice/user').then(res => {
      if (res.data.Code === "007" || res.data.Code === "004") {
        message.error("获取管理员失败")
      } else {
        this.setState({ personData: res.data, tableLoading: false });
        constUserData = res.data;
      }
    }).catch(function (error) {
      console.dir(error);
    })
  }

  deleteUser = (value) => {
    if (value.length === 0) {
      message.warn("请选择人员进行删除！")
      return;
    }
    axios.post('/borrowservice/deleteuser', {
      Userids: value
    }).then(res => {
      if (res.data.Code === "009") {
        message.warn(res.data.Message)
      } else if (res.data.Code === "007") {
        message.warn("删除用户失败")
      } else {
        this.setState({
          deleteModal: false,
        })
        message.success("删除用户成功！")
        this.requestAllUser();
      }
    }).catch(err => {
      console.log(err);

    });
  }

  handleDeleteOk = () => {
    // this.state.selectedRows.forEach(item => item.isShow = false);
    this.deleteUser(userIdArr)
    // this.setState({
    //   deleteModal: false
    // });

  }


  handleCancel = (e) => {
    this.setState({
      userModal: false,
      deleteModal: false,
      groupModal: false,
      permissionModal: false
    });

  }

  // getSearchData = (value) =>{
  //   console.log(value);
  // }
  getSearchData(value) {


    this.setState({
      personData: constUserData.filter(item => (item.Username.indexOf(value) > -1))
    })
  }

  render() {
    // const { personalManage } = this.state;
    // 用这句注释删除的时候是全部删除而不是一列一列删除
    // const showData = this.state.personData.filter(item => item.isShow);
    // this.state.personData = this.state.personData.filter(item => item.isShow);
    const menu = <Menu>
      <Menu.Item>
        <a target="_blank">人员编辑</a>
      </Menu.Item>
    </Menu>;
 

    const { form } = this.props;
    const { getFieldDecorator } = form;
    const Search = Input.Search;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'Username',
        key: 'Username'
      },
      {
        title: '用户ID',
        dataIndex: 'Usernumber',
        //这边设置为description为什么会报错
        key: 'Usernumber'
      },
      {
        title: '部门',
        dataIndex: 'Department',
        key: 'Department'
      },
      {
        render: (text, record) => {
          // console.log(record);
          return (
            <div>
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
        userIdArr = [];
        for (var user of selectedRows) {
          userIdArr.push(user.Id);
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        // console.log(selected, selectedRows, changeRows);
        userIdArr = [];
        for (var user of selectedRows) {
          userIdArr.push(user.Id);
        }
      },
    };
    //分页
    const pagination = {
      total: this.state.personData.length,
      // showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 8,
      pageSize: 8
    };
    // const modalPagination = {
    //   total: this.state.equipPermission.length,
    //   hideOnSinglePage: true,
    //   pageSize: this.state.equipPermission.length

    // };
    //权限标签
    const Option = Select.Option;
    let children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }


    return (

      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>人员管理</Breadcrumb.Item>
        </Breadcrumb>

        {this.state.userModal && <Modal
          title={modalName}
          visible={this.state.userModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          transparent={true}
          okText="确认"
          cancelText="取消"
        /*key={this.state.key}*/
        >
          <section>
            <Form>
              <FormItem label="姓名：" {...formLayout}>
                {getFieldDecorator('Username', {
                  initialValue: this.recePerson.Username,
                  rules: [
                    {
                      type: 'string',
                      required: true                     
                    }
                  ]
                })(
                  <Input type="text" placeholder="请输入姓名" />
                )}
              </FormItem>

              <FormItem label="用户ID：" {...formLayout}>
                {getFieldDecorator('Usernumber', {
                  initialValue: this.recePerson.Usernumber,
                  rules: [
                    {
                      pattern: /^.{3,15}([0-9]|)$/,
                      required: true,
                      message: '用户ID只能输入数字'
                    }
                  ]
                })(
                  <Input placeholder="请输入用户ID" />
                )}
              </FormItem>


              <FormItem label="部门：" {...formLayout}>
                {getFieldDecorator('Department', {
                  initialValue: this.recePerson.Department,
                  rules: [
                    {
                      type: 'string',
                      required: true
                    }
                  ]
                })(
                  <Input placeholder="请输入部门" />
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
          <p style={{ color: '#000000', fontSize: '1.2em' }}>确认删除当前选中人员</p>

        </Modal>



        <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>

          <Button style={{ marginLeft: 2 }} type="primary" onClick={() => this.showModal()}>添加</Button>
          <Button style={{ marginLeft: 5 }} type="danger" onClick={() => this.showDeleteModal()}>删除</Button>

          <Search
            placeholder="请输入用户名查询"
            onSearch={value => this.getSearchData(value)}
            style={{ width: 300, float: 'right' }}
            enterButton
          />
          <br /><br />
          {/*<Input type="search" placeholder="请输入" style={{ width: '300px', float: 'right' }}></Input><br /><br /><br />*/}
          {/* <Button className="addspan" onClick={() => this.showModal()}>+添加</Button><br /><br /><br /> */}
          <Spin size="large" spinning={this.state.tableLoading} >
            <Table showHeader={true} rowSelection={rowSelection} columns={columns} dataSource={this.state.personData} rowKey={row => row.Id} pagination={pagination} />
          </Spin>
        </div>
      </Content>
    );
  }
}

PersonalManage.contextTypes = { router: PropTypes.object.isRequired };
PersonalManage = Form.create()(PersonalManage);
export default PersonalManage;




