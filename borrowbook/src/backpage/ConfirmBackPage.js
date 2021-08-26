import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import {Toast, List, InputItem, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import { PropTypes } from 'prop-types';

const alert = Modal.alert;


function successToast() {
  Toast.success('借阅成功! 阅读完请及时归还', 3);
 
}

class ConfirmBackPage extends Component {

  handleClick = () => {
    this.inputRef.focus();
  }

  confirmSubmit = () => {

    successToast();

    setTimeout(() => {
      this.context.router.push('/')
    },3000)
    
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <List renderHeader={() => '请确认个人信息是否有误'}>
          <InputItem
            {...getFieldProps('focus')}
            clear
            placeholder="click the button below to focus"
            ref={el => this.inputRef = el}
          >员工编号</InputItem>
          {/* 输入员工证编号自动跳出姓名和部门 */}
          <InputItem
            {...getFieldProps('autofocus')}
            clear
            placeholder="auto focus"
            ref={el => this.autoFocusInst = el}
          >姓名</InputItem>

          <InputItem
            {...getFieldProps('focus')}
            clear
            placeholder="click the button below to focus"
            ref={el => this.inputRef = el}
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
              确认归还
            </div>
          </List.Item>
          {/* <WhiteSpace /> */}


        </List>

        {/* <Button type="primary" inline size="small" style={{ marginRight: '4px' }}>确认提交</Button> */}

      </div>
    );
  }
}
ConfirmBackPage.contextTypes = { router: PropTypes.object.isRequired };
const BBackPage = createForm()(ConfirmBackPage);

export default BBackPage;
