import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {listBacklogs, changeBacklog} from "../../actions/backlogActions"
import { Table, Icon, Button, Modal, Form, Input, Pagination, Row, Col, Select, message } from 'antd';
const FormItem = Form.Item;
import Header from "../common/Header";
import ProductSidebar from "./ProductSidebar";
import RichEditor from "../../common/editor/RichEditor";

const Backlog = React.createClass({
    changePage: function (page) {
        this.loadData(page);
    },
    componentDidMount: function() {
        this.loadData(1);
    },
    loadData: function (page = 1) {
        this.setState({selects: []});
        Fetch.get(`${API_URL.backlog.list}?productId=${this.props.location.query.id}&page=${page}`).then(data=>
            store.dispatch(listBacklogs(data.backlogs, data.totalPages, page))
        );
    },
    getInitialState: function () {
        return {selects: []}
    },
    getColumns: function () {
        return [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },{
            title: 'Importance',
            dataIndex: 'importance',
            width: 90,
            key: 'importance'
        },{
            title: '已加入Sprint',
            dataIndex: 'sprint.name',
            key: 'sprint.name'
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 160,
            key: 'createdAt',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        }, {
            title: '操作',
            key: 'operation',
            width: 160,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeBacklog(record));
                        this.refs.modal.show();
                    }}>编辑</a>
                    <span className="ant-divider"/>
                    <a href="#" onClick={()=>this.del(record.id)}>删除</a>
                    <span className="ant-divider"/>
                    <a href="#" onClick={()=>this.delFromSprint(record.id)}>移出Sprint</a>
                </span>
            ),
        }];
    },
    onChange: function (selectedRowKeys, selectedRows) {
        this.setState({selects: selectedRowKeys});
    },
    add: function () {
        store.dispatch(changeBacklog({productId: this.props.location.query.id}));
        this.refs.modal.show();
    },
    del: function(id){
        if(confirm("确定要删除吗?")){
            Fetch.del(`${API_URL.backlog.del}${id}?productId=${this.props.location.query.id}`).then(() => this.loadData());
        }
    },
    add2sprint: function () {
        if(this.state.selects.length==0){
            message.warning('你还没有选择Backlog');
        }else{
            this.refs.add2sprint.show();
        }
    },
    delFromSprint: function (id) {
        if(confirm("确定要移出吗?")){
            Fetch.post(API_URL.backlog.delFromSprint, {body:`id=${id}`}).then(() => this.loadData());
        }
    },
    expandRow: function (record) {
        return (
            <table className="tableDetail">
                <tr>
                    <th style={{width:'100px'}}>用户故事</th>
                    <td dangerouslySetInnerHTML={{__html: `${record.story!=null?record.story:''}`}} />
                </tr>
                <tr>
                    <th>如何演示</th>
                    <td dangerouslySetInnerHTML={{__html: `${record.demo!=null?record.demo:''}`}} />
                </tr>
                <tr>
                    <th>备注</th>
                    <td dangerouslySetInnerHTML={{__html: `${record.note!=null?record.note:''}`}} />
                </tr>
            </table>
        )
    },
    render: function() {
        return (
            <div>
                <Header current="product"/>
                <Row gutter={10}>
                    <Col className="gutter-row" span={6}>
                        <ProductSidebar productId={this.props.location.query.id} current="backlog"/>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <h2>{this.props.location.query.name}</h2>
                        <Table columns={this.getColumns()}
                               dataSource={this.props.backlogs}
                               del={this.del}
                               expandedRowRender={this.expandRow}
                               rowKey='id'
                               expandIconAsCell={false}
                               title={()=>(<div><Button type="primary" size="large" onClick={this.add}>新建</Button> <Button size="large" onClick={this.add2sprint}>加入Sprint</Button></div>)}
                               rowSelection={{onChange: this.onChange, selectedRowKeys: this.state.selects,　getCheckboxProps: record => ({disabled: record.sprint}) }}
                               pagination={{total: this.props.totalPages,　onChange:this.changePage}}/>
                        <BacklogFormModal backlog={this.props.backlog} reload={this.loadData} ref="modal"/>
                        <Add2SprintModal backlogs={this.state.selects} productId={this.props.location.query.id} reload={this.changePage} ref="add2sprint"/>
                    </Col>
                </Row>
            </div>
        )
    }
});

class BacklogForm extends React.Component{
    render () {
        const { getFieldProps } = this.props.form;
        return (
            <Form horizontal>
                <Input {...getFieldProps('id')} type="hidden"/>
                <Input {...getFieldProps('productId')} type="hidden"/>
                <FormItem
                    label="Name"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('name', {})} type="text"/>
                </FormItem>
                <FormItem
                    label="Importance"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('importance', {
                        rules: [{ max: 10000, message:'请输入小于10000的整数', type:'integer', transform: value => value?Number(value):0}]
                    })} type="text"/>
                </FormItem>
                <FormItem
                    label="User Story"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <RichEditor {...getFieldProps('story',{
                        rules: [{ max:1000, message:'最多1000个字符'},]
                    })}/>
                </FormItem>
                <FormItem
                    label="How to demo"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <RichEditor {...getFieldProps('demo',{
                        rules: [{ max:1000, message:'最多1000个字符'},]
                    })}/>
                </FormItem>
                <FormItem
                    label="Notes"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <RichEditor {...getFieldProps('note',{
                        rules: [{ max:1000, message:'最多1000个字符'},]
                    })}/>
                </FormItem>
            </Form>
        );
    }
}

const Add2SprintModal = React.createClass({
    getInitialState: function () {
        return {visible: false, sprints:[], sprintId:''};
    },
    submit: function(){
        if(!this.state.sprintId){
            message.error("请选择一个Sprint加入");
        }else{
            Fetch.postJSON(API_URL.backlog.add2Sprint, {body:JSON.stringify({sprintId:this.state.sprintId, backlogs:this.props.backlogs})}).then((failures)=>{
                if(failures.length!=0){
                    message.error("有以下几个Backlog加入失败: "+failures.join(","));
                }else{
                    message.success("加入成功!");
                }
                this.hide();
                this.props.reload();
            });
        }
    },
    show: function(){
        this.loadSprints();
        this.setState({visible: true});
    },
    hide: function() {
        this.setState({ visible: false });
    },
    loadSprints: function () {
        Fetch.get(`${API_URL.sprint.listAll}?productId=${this.props.productId}`).then(function(data){
            this.setState({ sprints: data });
        }.bind(this));
    },
    changeSprint: function (value) {
        this.setState({sprintId: value});
    },
    render: function() {
        const options = this.state.sprints.map(sprint => <Select.Option key={sprint.id} value={sprint.id}>{sprint.name}</Select.Option>);
        return (
            <Modal title="加入Sprint" visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <Form horizontal>
                    <FormItem
                        label="选择Sprint"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}>
                        <Select ref="select" defaultValue={0} onChange={this.changeSprint}>
                            <Select.Option key={0} value="0">请选择</Select.Option>
                            {options}
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

const BacklogFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if(this.props.backlog.id){
                this.update();
            }else{
                this.add();
            }
        });
    },
    add: function () {
        Fetch.postJSON(API_URL.backlog.add, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
            this.props.reload();
            this.hide();
        });
    },
    update: function () {
        Fetch.putJSON(`${API_URL.backlog.update}/${this.props.backlog.id}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
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
        let title = this.props.backlog.id? "修改Backlog":"添加Backlog";
        let _this = this;
        BacklogForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.backlog.id},
                    name: {value: _this.props.backlog.name},
                    story: {value: _this.props.backlog.story},
                    note: {value: _this.props.backlog.note},
                    importance: {value: _this.props.backlog.importance},
                    demo: {value: _this.props.backlog.demo},
                    productId: {value: _this.props.backlog.productId},
                };
            }
        })(BacklogForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide} width={700}>
                <BacklogForm ref="form"/>
            </Modal>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        backlogs: store.backlogState.backlogs,
        backlog: store.backlogState.backlog,
        totalPages: store.backlogState.totalPages
    };
};

export default connect(mapStateToProps)(Backlog);