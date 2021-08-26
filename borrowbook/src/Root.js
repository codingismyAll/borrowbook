

import React from 'react';
import NotFound from './NotFound';
import HomePage from "./homepage/HomePage"
import BorrowPage from "./borrowpage/App"
import BackPage from "./backpage/BackPage"
import QueryPage from "./borrowpage/QueryPage"
import BBackPage from "./backpage/ConfirmBackPage"
import { Router, Route, hashHistory } from 'react-router';

const Root = () => (
    <Router history={hashHistory}>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/querypage" component={QueryPage}/>
        <Route exact path="/borrowpage" component={BorrowPage}/>
        <Route exact path="/backpage" component={BackPage}/>
        <Route exact path="/confirmbackpage" component={BBackPage}/>
        <Route component={NotFound} />
    </Router>
);


export default Root;