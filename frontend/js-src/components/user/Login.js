/**
 * Created by sunlong on 16/8/3.
 */
import React from "react";
import Fetch from '../../common/FetchIt';
import API_URL from "../../common/url";
import {Button, Form, Input, } from 'antd';
import Auth from '../../common/Auth';
import "./user.less";
const FormItem = Form.Item;

class LoginForm extends React.Component{
    login = ()=>{
        let loginName = this.refs.loginName.value;
        let password = this.refs.password.value;
        Fetch.post(API_URL.user.login, {body:`loginName=${loginName}&password=${password}`}).then((token)=>{
            new Auth().login(token);
        });
    };

    render () {
        return (
            <Form horizontal className="loginForm">
                <FormItem
                    label="姓名/邮箱"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 13 }}>
                    <input ref="loginName" type="text"/>
                </FormItem>
                <FormItem
                    label="密码"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 13 }}>
                    <input ref="password" type="password" />
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 13, offset: 11 }}>
                    <Button type="primary" htmlType="submit" onClick={this.login}>登录</Button>
                </FormItem>
            </Form>
        );
    }
}

export default LoginForm;