/**
 * Created by sunlong on 16/8/5.
 */
import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {listEnterprises, changeEnterprise} from "../../actions/enterpriseActions"
import Header from "../common/Header";
import Auth from "../../common/Auth";
import { Table, Icon, Button, Modal, Form, Input, Pagination } from 'antd';
const FormItem = Form.Item;

const Enterprise = React.createClass({
    changePage: function (page) {
        this.loadData(page);
    },
    componentDidMount: function() {
        new Auth().check();
        this.loadData(1);
    },
    loadData: function (page = 1) {
        Fetch.get(API_URL.enterprise.list).then(data=>
            store.dispatch(listEnterprises(data.enterprises, data.totalPages))
        );
    },
    del: function(id){
        if(confirm("确定要删除吗?")){
            Fetch.del(API_URL.enterprise.del + id).then(() => this.loadData());
        }
    },
    add: function () {
        store.dispatch(changeEnterprise({}));
        this.refs.modal.show();
    },
    getColumns: function () {
        return [{
            title: '企业名称',
            dataIndex: 'name',
            key: 'name'
        },{
            title: '管理员',
            dataIndex: 'users',
            key: 'users',
            render: (text, record) => (
                record.users[0].name
            ),
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeEnterprise(record));
                        this.refs.modal.show();
                    }}>编辑</a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={()=>this.del(record.id)}>删除</a>
                </span>
            ),
        }];
    },
    exportExcel: function () {
        location.href = `${API_URL.enterprise.exportExcel}?enterpriseIds=${this.props.selects}`;
    },
    render: function() {
        return (
            <div>
                <Header current="enterprise"/>
                <Button type="primary" size="large" onClick={this.add}>新建</Button>
                <Table columns={this.getColumns()}
                       dataSource={this.props.enterprises}
                       pagination={{total: this.props.totalPages,　onChange:this.changePage}}/>
                <EnterpriseFormModal enterprise={this.props.enterprise} reload={this.loadData} ref="modal"/>
            </div>
        )
    }
});

class EnterpriseForm extends React.Component{
    render () {
        const { getFieldProps } = this.props.form;
        return (
            <Form horizontal>
                <Input {...getFieldProps('id')} type="hidden"/>
                <FormItem
                    label="名称"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('name', {})} type="text"/>
                </FormItem>
                <FormItem
                    label="管理员名称"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('username', {})} type="text"/>
                </FormItem>
                <FormItem
                    label="管理员密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('password', {})} type="password"/>
                </FormItem>
                <FormItem
                    label="管理员邮箱"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('email', {})} type="text"/>
                </FormItem>
            </Form>
        );
    }
}

const EnterpriseFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        if(this.props.enterprise.id){
            this.update();
        }else{
            this.add();
        }
    },
    add: function () {
        Fetch.postJSON(API_URL.enterprise.add, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
            this.props.reload();
            this.hide();
        });
    },
    update: function () {
        Fetch.putJSON(`${API_URL.enterprise.update}/${this.props.enterprise.id}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
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
        let title = this.props.enterprise.id? "修改企业":"添加企业";
        let _this = this;
        EnterpriseForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.enterprise.id},
                    name: {value: _this.props.enterprise.name},
                };
            }
        })(EnterpriseForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <EnterpriseForm ref="form"/>
            </Modal>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        enterprise: store.enterpriseState.enterprise,
        enterprises: store.enterpriseState.enterprises,
        totalPages: store.enterpriseState.totalPages
    };
};

export default connect(mapStateToProps)(Enterprise);