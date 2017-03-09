import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {listSprints, changeSprint} from "../../actions/sprintActions"
import { Table, Icon, Button, Modal, Form, Input, Row, Col, DatePicker, Select } from 'antd';
const FormItem = Form.Item;
import Header from "../common/Header";
import ProductSidebar from "./ProductSidebar";
import SprintBacklog from "./SprintBacklog";
import KanbanModal from "./Kanban";
import ChartModal from "./ChartModal";

const Sprint = React.createClass({
    changePage: function (page) {
        this.loadData(page);
    },
    componentDidMount: function() {
        this.loadData(1);
    },
    loadData: function (page = 1) {
        Fetch.get(`${API_URL.sprint.list}?productId=${this.props.location.query.id}`).then(data=>
            store.dispatch(listSprints(data.sprints, data.totalPages))
        );
    },
    getColumns: function () {
        return [{
            title: '冲刺名称',
            dataIndex: 'name',
            key: 'name'
        },{
            title: '开始时间',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        },{
            title: '计划结束时间',
            dataIndex: 'planningEndDate',
            key: 'planningEndDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        },{
            title: '实际结束时间',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        },{
            title: '负责人',
            dataIndex: 'owner',
            key: 'owner',
            render: (text, record) => (
                record.user?record.user.name:''
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
            render: (text, record) => {
                let chart = '';
                if(record.startDate && record.planningEndDate){
                    chart = <span><a href="#" onClick={()=>{
                                    store.dispatch(changeSprint(record));
                                    this.refs.chartModal.show();
                                }}>燃尽图</a>
                                <span className="ant-divider"/>
                            </span>
                }
                return (
                    <span>
                        <a href="#" onClick={()=>{
                            store.dispatch(changeSprint(record));
                            this.refs.kanbanModal.show();
                        }}>管理</a>
                        <span className="ant-divider"/>
                        {chart}
                        <a href="#" onClick={()=>{
                            store.dispatch(changeSprint(record));
                            this.refs.modal.show();
                        }}>编辑</a>
                        <span className="ant-divider"/>
                        <a href="#" onClick={()=>this.del(record.id)}>删除</a>
                    </span>
                )
            },
        }];
    },
    add: function () {
        store.dispatch(changeSprint({productId: this.props.location.query.id}));
        this.refs.modal.show();
    },
    del: function(id){
        if(confirm("确定要删除吗?")){
            Fetch.del(API_URL.sprint.del + id).then(() => this.loadData());
        }
    },
    exportDailyExcel: function () {
        location.href = `${API_URL.sprintBacklog.exportExcel}?sprintIds=${this.state.sprintIds}&access_token=${sessionStorage.token}`;
    },
    onChange: function (selectedRowKeys, selectedRows) {
        this.setState({sprintIds: selectedRowKeys});
    },
    getInitialState: function () {
        return {sprintIds:[]}
    },
    render: function() {
        return (
            <div>
                <Header current="product"/>
                <Row gutter={10}>
                    <Col className="gutter-row" span={6}>
                        <ProductSidebar productId={this.props.location.query.id} current="sprint"/>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <h2>{this.props.location.query.name}</h2>
                        <Button type="primary" size="large" onClick={this.add}>新建</Button>&nbsp;
                        <Button size="large" onClick={this.exportDailyExcel}>导出日报</Button>
                        <Table columns={this.getColumns()}
                               dataSource={this.props.sprints}
                               del={this.del}
                               rowKey={record => record.id}
                               rowSelection={{onChange: this.onChange}}
                               pagination={{total: this.props.totalPages,　onChange:this.changePage}}/>
                        <SprintFormModal sprint={this.props.sprint} reload={this.loadData} ref="modal" />
                        <SprintBacklogModal sprintId={this.props.sprint.id} ref="sprintBacklogModal"/>
                        <KanbanModal sprintId={this.props.sprint.id} ref="kanbanModal"/>
                        <ChartModal sprintId={this.props.sprint.id} ref="chartModal"/>
                    </Col>
                </Row>
            </div>
        )
    }
});

class SprintForm extends React.Component{
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
        const options = this.state.users.map(user => <Select.Option key={user.id} value={user.id}>{user.name}</Select.Option>);
        return (
            <Form horizontal>
                <Input {...getFieldProps('id')} type="hidden"/>
                <Input {...getFieldProps('productId')} type="hidden"/>
                <FormItem
                    label="冲刺名称"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('name', {
                        rules: [{ required: true , message:'必填'}, { max:32, message: '最多为 32 个字符' },]
                    })} type="text"/>
                </FormItem>
                <FormItem
                    label="开始时间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('startDate',{
                        rules: [{ required: true , message:'必填', type: 'date', transform: value=>new Date(value)},]
                    })}/>
                </FormItem>
                <FormItem
                    label="计划结束时间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('planningEndDate')}/>
                </FormItem>
                <FormItem
                    label="实际结束时间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('endDate')}/>
                </FormItem>
                <FormItem
                    label="负责人"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Select showSearch
                            {...getFieldProps('userId', {
                                rules: [{ required: true , type: "number", message:'必填'},]
                            })}
                            placeholder="请选择"
                            optionFilterProp="children">
                        {options}
                    </Select>
                </FormItem>
            </Form>
        );
    }
}

const SprintFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if(this.props.sprint.id){
                this.update();
            }else{
                this.add();
            }
        });
    },
    add: function () {
        Fetch.postJSON(API_URL.sprint.add, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
            this.props.reload();
            this.hide();
        });
    },
    update: function () {
        Fetch.putJSON(`${API_URL.sprint.update}/${this.props.sprint.id}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
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
        let title = this.props.sprint.id? "修改Sprint":"添加Sprint";
        let _this = this;
        SprintForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.sprint.id},
                    name: {value: _this.props.sprint.name},
                    userId: {value: _this.props.sprint.userId},
                    startDate: {value: _this.props.sprint.startDate},
                    endDate: {value: _this.props.sprint.endDate},
                    planningEndDate: {value: _this.props.sprint.planningEndDate},
                    productId: {value: _this.props.sprint.productId},
                };
            }
        })(SprintForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <SprintForm ref="form"/>
            </Modal>
        );
    }
});

const SprintBacklogModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    show: function(){
        this.setState({visible: true});
    },
    hide: function() {
        this.setState({ visible: false });
    },
    render: function() {
        return (
            <Modal title="Sprint Backlog" visible={this.state.visible} onCancel={this.hide} width={1200} footer="">
                <SprintBacklog sprintId={this.props.sprintId}/>
            </Modal>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        sprints: store.sprintState.sprints,
        sprint: store.sprintState.sprint,
        totalPages: store.sprintState.totalPages
    };
};

export default connect(mapStateToProps)(Sprint);