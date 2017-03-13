import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import AppBottom from './components/common/AppBottom';
import MyTest from './components/mytest/MyTest';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/index.html" component={MyTest}/>
            <Route path="/mytest" component={MyTest}/>
        </Router>
    </Provider>,
    document.getElementById('content')
);

ReactDOM.render(
    <AppBottom/>,
    document.getElementById('bottom')
);