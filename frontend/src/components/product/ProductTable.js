import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {Link} from "react-router";
import {listProducts, changeProduct, selectProducts, cancelSelectProducts} from "../../actions/productActions"
import Header from "../common/Header";
import Auth from "../../common/Auth";
import { Table, Icon, Button, Modal, Form, Input, Pagination, Select, Transfer, message } from 'antd';
const FormItem = Form.Item;
import "./product.less"

const ProductTable = React.createClass({
    changePage: function (page) {
        this.loadData(page);
    },
    componentDidMount: function() {
        new Auth().check();
        this.loadData(1);
    },
    loadData: function (page = 1) {
        Fetch.get(API_URL.product.list).then(data=>
            store.dispatch(listProducts(data.products, data.totalPages))
        );
    },
    del: function(id){
        if(confirm("确定要删除吗?")){
            Fetch.del(API_URL.product.del + id).then(() => this.loadData());
        }
    },
    add: function () {
        store.dispatch(changeProduct({}));
        this.refs.modal.show();
    },
    getColumns: function () {
        return [{
            title: '产品名称',
            dataIndex: 'name',
            key: 'name'
        },{
            title: 'Product Owner',
            dataIndex: 'user.name',
            key: 'user.name'
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
                    <Link to={`/user/backlog?id=${record.id}&name=${record.name}`}>管理</Link>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeProduct(record));
                        this.refs.userModal.show();
                    }}>成员</a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeProduct(record));
                        this.refs.modal.show();
                    }}>编辑</a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={()=>this.del(record.id)}>删除</a>
                </span>
            ),
        }];
    },
    exportExcel: function () {
        location.href = `${API_URL.product.exportExcel}?productIds=${this.props.selects}`;
    },
    onSelect: function (record, selected, selectedRows) {
        if(selected){
            store.dispatch(selectProducts([record.id]));
        }else{
            store.dispatch(cancelSelectProducts([record.id]));
        }
    },
    render: function() {
        return (
            <div>
                <Header current="product"/>
                <div className="product">
                    <h2>我的产品</h2>
                    <Button type="primary" size="large" onClick={this.add}>新建</Button>
                    <Button size="large" onClick={this.exportExcel}>导出周报</Button>
                    <Table columns={this.getColumns()}
                           dataSource={this.props.products}
                           rowSelection={{onSelect: this.onSelect}}
                           pagination={false} />
                    <ProductFormModal product={this.props.product} reload={this.loadData} ref="modal"/>
                    <UserModal productId={this.props.product.id} ref="userModal"/>
                </div>
            </div>
        )
    }
});

class UserModal extends React.Component{
    constructor(){
        super();
        this.state = {users:[], members:[]}
    }
    componentDidMount = ()=>{
        Fetch.get(API_URL.user.listAll).then(users => {
            this.setState({users: users});
        });

        this.loadMembers(this.props.productId);
    };
    componentWillReceiveProps = (nextProps)=>{
        if(this.props.productId != nextProps.productId){
            this.loadMembers(nextProps.productId);
        }
    };
    loadMembers = (productId)=>{
        Fetch.get(`${API_URL.product.members}?productId=${productId}`).then(members => {
            this.setState({members: members});
        });
    };
    show = ()=>{
        this.setState({visible: true});
    };
    hide = ()=>{
        this.setState({ visible: false });
    };
    handleChange = (targetKeys, direction)=>{
        if(direction == "right"){
            this.setState({members: targetKeys})
        }else{
            let newMembers = this.state.members.filter(member=>{
                return targetKeys.indexOf(member)!=-1;
            });
            this.setState({members: newMembers})
        }
    };
    submit = ()=>{
        Fetch.postJSON(API_URL.product.members, {body: JSON.stringify({userIds: this.state.members, productId: this.props.productId})}).then(users => {
            message.info("保存成功!");
            this.hide();
        });
    };
    render() {
        return (
            <Modal title="成员" visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <Transfer
                    rowKey={record => record.id}
                    dataSource={this.state.users}
                    targetKeys={this.state.members}
                    onChange={this.handleChange}
                    listStyle={{
                        width: 220,
                        height: 300,
                    }}
                    titles={['全部人员','产品成员']}
                    render={item => item.name}/>
            </Modal>
        );
    }
}

class ProductForm extends React.Component{
    constructor(){
        super();
        this.state = {users:[]}
    }
    componentDidMount = ()=>{
        Fetch.get(API_URL.user.listAll).then(users => {
            this.setState({users: users})
        });
    };
    render () {
        const { getFieldProps } = this.props.form;
        let owner = '';
        if(JSON.parse(sessionStorage.user).isAdmin){
            const options = this.state.users.map(user => <Select.Option key={user.id} value={""+user.id}>{user.name}</Select.Option>);
            owner = <FormItem
                label="Owner"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}>
                <Select showSearch
                        {...getFieldProps('userId', {})}
                        placeholder="请选择"
                        optionFilterProp="children">
                    {options}
                </Select>
            </FormItem>
        }
        return (
            <Form horizontal>
                <Input {...getFieldProps('id')} type="hidden"/>
                <FormItem
                    label="名称"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('name', {
                        rules: [{max: 32, message:'最多32个字符'},{required: true, message:'必填'}]
                    })} type="text"/>
                </FormItem>
                {owner}
            </Form>
        );
    }
}

const ProductFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if(this.props.product.id){
                this.update();
            }else{
                this.add();
            }
        });
    },
    add: function () {
        Fetch.postJSON(API_URL.product.add, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
            this.props.reload();
            this.hide();
        });
    },
    update: function () {
        Fetch.putJSON(`${API_URL.product.update}/${this.props.product.id}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
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
        let title = this.props.product.id? "修改产品":"添加产品";
        let _this = this;
        ProductForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.product.id},
                    name: {value: _this.props.product.name},
                    userId: {value: _this.props.product.userId},
                };
            }
        })(ProductForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <ProductForm ref="form"/>
            </Modal>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        product: store.productState.product,
        products: store.productState.products,
        selects: store.productState.selects,
        totalPages: store.productState.totalPages
    };
};

export default connect(mapStateToProps)(ProductTable);