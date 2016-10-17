import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {listUsers, changeUser} from "../../actions/userActions"
import { Table, Icon, Button, Modal, Form, Input, Pagination, DatePicker, message } from 'antd';
const FormItem = Form.Item;
import Header from "../common/Header";
import "./user.less";

const User = React.createClass({
    changePage: function (page) {
        this.loadData(page);
    },
    componentDidMount: function() {
        this.loadData(1);
    },
    loadData: function (page = 1) {
        Fetch.get(API_URL.user.list).then(data=>
            store.dispatch(listUsers(data.users, data.totalPages))
        );
    },
    getColumns: function () {
        return [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        },{
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
        },{
            title: '管理员',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (text) => (
                text ? '是': ''
            ),
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => (
                `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}`
            ),
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeUser(record));
                        this.refs.modal.show();
                    }}>编辑</a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeUser(record));
                        this.refs.passwordModal.show();
                    }}>重置密码</a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={()=>this.del(record.id)}>删除</a>
                </span>
            ),
        }];
    },
    add: function () {
        store.dispatch(changeUser({}));
        this.refs.modal.show();
    },
    del: function(id){
        if(confirm("确定要删除吗?")){
            Fetch.del(API_URL.user.del + id).then(() => this.loadData());
        }
    },
    render: function() {
        return (
            <div>
                <Header current="user"/>
                <div className="user">
                    <h2>用户管理</h2>
                    <Button type="primary" size="large" onClick={this.add}>新建</Button>
                    <Table columns={this.getColumns()}
                           dataSource={this.props.users}
                           del={this.del}
                           pagination={{total: this.props.totalPages,　onChange:this.changePage}}/>
                    <UserFormModal user={this.props.user} reload={this.loadData} ref="modal"/>
                    <PasswordFormModal user={this.props.user} ref="passwordModal"/>
                </div>
            </div>
        )
    }
});

class UserForm extends React.Component{
    render () {
        const { getFieldProps } = this.props.form;
        let password = '';
        if(!this.props.form.getFieldValue('id')){
            password = <FormItem
                label="密码"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}>
                <Input {...getFieldProps('password', {
                    rules: [{max: 32, message:'最多32个字符'},{required: true, message:'必填'}]
                })} type="password" />
            </FormItem>
        }
        return (
            <Form horizontal>
                <Input {...getFieldProps('id')} type="hidden"/>
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
                {password}
            </Form>
        );
    }
}

const UserFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if(this.props.user.id){
                this.update();
            }else{
                this.add();
            }
        });
    },
    add: function () {
        Fetch.postJSON(API_URL.user.add, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
            this.props.reload();
            this.hide();
        });
    },
    update: function () {
        Fetch.putJSON(`${API_URL.user.update}/${this.props.user.id}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
            this.props.reload();
            this.hide();
        });
    },
    show: function(){
        this.setState({visible: true});
    },
    hide: function() {
        this.setState({ visible: false });
    },
    render: function() {
        let title = this.props.user.id? "修改用户":"添加用户";
        let _this = this;
        UserForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.user.id},
                    name: {value: _this.props.user.name},
                    email: {value: _this.props.user.email},
                };
            }
        })(UserForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <UserForm ref="form"/>
            </Modal>
        );
    }
});

class PasswordForm extends React.Component{
    render () {
        const { getFieldProps } = this.props.form;
        return (
            <Form horizontal>
                <Input {...getFieldProps('id')} type="hidden"/>
                <FormItem
                    label="新密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('password', {
                        rules: [{max: 32, message:'最多32个字符'},{required: true, message:'必填'}]
                    })} type="password"/>
                </FormItem>
                <FormItem
                    label="重复密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('rePassword', {
                        rules: [{max: 32, message:'最多32个字符'},{required: true, message:'必填'}]
                    })} type="password"/>
                </FormItem>
            </Form>
        );
    }
}

const PasswordFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            Fetch.putJSON(API_URL.user.password, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
                message.info("修改成功!");
                this.hide();
            });
        });
    },
    show: function(){
        this.setState({visible: true});
    },
    hide: function() {
        this.setState({ visible: false });
    },
    render: function() {
        var _this = this;
        PasswordForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.user.id},
                };
            }
        })(PasswordForm);
        return (
            <Modal title="重置密码" visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <PasswordForm ref="form"/>
            </Modal>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        users: store.userState.users,
        user: store.userState.user,
        totalPages: store.userState.totalPages
    };
};

export default connect(mapStateToProps)(User);