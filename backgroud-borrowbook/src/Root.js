

import React from 'react';
import NotFound from './NotFound';
import { Router, Route, hashHistory } from 'react-router';
import SiderDemo from './Navi/Navi';
import LoginPage from './login/login';
import PersonPage from './person/PersonalManage'; 
import BookPage from './book/BookManage'
import BookBackPage from './bookbackup/BookBackup'

const Root = () => (
    <Router history={hashHistory}>
        <Route component={SiderDemo}>
            <Route exact path="/person" component={PersonPage} />
            <Route exact path="/bookmanager" component={BookPage} />
            <Route exact path="/bookbackup" component={BookBackPage} />
            <Route component={NotFound} />
        </Route>
        <Route path="/" component={LoginPage} />
    </Router>
);


export default Root;