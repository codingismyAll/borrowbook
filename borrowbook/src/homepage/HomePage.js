import React, { Component } from 'react';
// import logo from './logo.svg';

import { Button } from 'antd-mobile';
import { PropTypes } from 'prop-types';



class HomePage extends Component {

  goBorrowPage = () => {
    localStorage.removeItem('searchbookname');
    this.context.router.push({
      pathname:'/querypage'
    });
   

  }
  goBackPage = () => {
    this.context.router.push({
      pathname:'/backpage',
      
    })
  }
  render() {
  
    return (
      <div style={{width:"50%",margin:"0 auto",marginTop:"50%"}}>
        <Button style={{marginBottom:"5%"}} type="primary" onClick={this.goBorrowPage}>借阅</Button>
        <Button type="primary" onClick={this.goBackPage}>查看记录</Button>
        
      </div>
    );
  }
}
HomePage.contextTypes = { router: PropTypes.object.isRequired };
export default HomePage;
