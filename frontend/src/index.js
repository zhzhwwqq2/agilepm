import React from "react";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import Home,{Product, Price} from "./components/Home";
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/index.html" component={Home}/>
            <Route path="/product" component={Product}/>
            <Route path="/price" component={Price}/>
        </Router>
    </Provider>,
    document.getElementById('content')
);