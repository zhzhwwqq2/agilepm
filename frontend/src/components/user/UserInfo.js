/**
 * Created by sunlong on 16/8/6.
 */
import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import {connect} from "react-redux";
import {changeUser} from "../../actions/userInfoActions"
import { Table, Icon, Button, Form, Input, message} from 'antd';
const FormItem = Form.Item;
import Header from "../common/Header";
import "./user.less";

const UserInfo = React.createClass({
    componentDidMount: function() {
        this.loadData(1);
    },
    loadData: function () {
        Fetch.get(API_URL.user.info).then(user=>store.dispatch(changeUser(user)));
    },
    render: function() {
        let _this = this;
        UserInfoForm = Form.create({
            mapPropsToFields() {
                return {
                    name: {value: _this.props.user.name},
                    email: {value: _this.props.user.email},
                    enterpriseName: {value: _this.props.user.enterpriseName},
                };
            }
        })(UserInfoForm);
        return (
            <div>
                <Header current="userInfo"/>
                <div className="user">
                    <h2>个人信息</h2>
                    <UserInfoForm />
                </div>
            </div>
        )
    }
});

class UserInfoForm extends React.Component{
    submit = ()=>{
        Fetch.putJSON(`${API_URL.user.updateInfo}`, {body:JSON.stringify(this.props.form.getFieldsValue())}).then(()=>{
            message.info("修改成功!");
        });
    };

    render () {
        const { getFieldProps } = this.props.form;
        return (
            <Form horizontal>
                <FormItem
                    label="我的企业"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('enterpriseName', {})} type="text" disabled/>
                </FormItem>
                <FormItem
                    label="姓名"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('name', {
                        rules: [{max: 32, message:'最多32个字符'},{required: true, message:'必填'}]
                    })} type="text"/>
                </FormItem>
                <FormItem
                    label="邮箱"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('email', {
                        rules: [{max: 64, message:'最多64个字符'},{message:'请输入正确的邮箱地址', type:'email'},{required: true, message:'必填'}]
                    })} type="text"/>
                </FormItem>
                <FormItem
                    label="密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('password', {
                        rules: [{max: 32, message:'最多32个字符'}]
                    })} type="password" />
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 14 , offset: 6}}>
                    <Button type="primary" onClick={this.submit}>保存</Button>
                </FormItem>
            </Form>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        user: store.userInfoState.user,
    };
};

export default connect(mapStateToProps)(UserInfo);