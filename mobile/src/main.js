import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import Product from './components/product/ProductTable';
import Dashboard from './components/Dashboard';
import Backlog from './components/product/Backlog';
import Sprint from './components/product/Sprint';
import User from './components/user/User';
import UserInfo from './components/user/UserInfo';
import Login from './components/user/Login';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/dashboard.html" component={Dashboard}/>
            <Route path="/user/product" component={Product}/>
            <Route path="/user/login" component={Login}/>
            <Route path="/user/backlog" component={Backlog}/>
            <Route path="/user/sprint" component={Sprint}/>
            <Route path="/user/user" component={User}/>
            <Route path="/user/userInfo" component={UserInfo}/>
        </Router>
    </Provider>,
    document.getElementById('content')
);