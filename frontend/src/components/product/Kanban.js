/**
 * Created by sunlong on 16/8/9.
 */
import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {changeSprintBacklog, listTodo, listDoing, listDone, changeProgress} from "../../actions/kanbanActions"
import { Table, Icon, Button, Modal, Form, Input,　DatePicker, Select, Tabs } from 'antd';
const FormItem = Form.Item;
import SprintBacklog, {SprintBacklogFormModal} from "./SprintBacklog";
import ProgressFormModal from "./ProgressFormModal";

class StartDateForm extends React.Component{
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
                <Input {...getFieldProps('sprintId')} type="hidden"/>
                <FormItem
                    label="开始时间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('startDate',{
                        rules: [{required: true, message:'必填', type: 'date'}]
                    })} />
                </FormItem>
                <FormItem
                    label="Owner"
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

const StartDateFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            Fetch.putJSON(`${API_URL.sprintBacklog.start}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
                this.props.reload();
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
        let _this = this;
        StartDateForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.sprintBacklog.id},
                    sprintId: {value: _this.props.sprintBacklog.sprintId},
                    startDate: {value: new Date()},
                };
            }
        })(StartDateForm);
        return (
            <Modal title="开始Sprint Backlog" visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <StartDateForm ref="form" />
            </Modal>
        );
    }
});

class EndDateForm extends React.Component{
    render () {
        const { getFieldProps } = this.props.form;
        return (
            <Form horizontal>
                <Input {...getFieldProps('id')} type="hidden"/>
                <FormItem
                    label="完成时间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('endDate')} />
                </FormItem>
            </Form>
        );
    }
}

const EndDateFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        Fetch.putJSON(`${API_URL.sprintBacklog.endDate}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
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
        let _this = this;
        EndDateForm = Form.create({
            mapPropsToFields() {
                return {
                    id: {value: _this.props.sprintBacklog.id},
                    endDate: {value: _this.props.sprintBacklog.endDate},
                };
            }
        })(EndDateForm);
        return (
            <Modal title="修改完成时间" visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <EndDateForm ref="form" />
            </Modal>
        );
    }
});

const Todo = React.createClass({
    changePage: function (page = 1) {
        this.loadData(page, this.props.sprintId);
    },
    componentDidMount: function() {
        this.loadData(1, this.props.sprintId);
    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.sprintId != this.props.sprintId){
            this.loadData(1, nextProps.sprintId);
        }
    },
    loadData: function (page = 1, sprintId) {
        Fetch.get(`${API_URL.sprintBacklog.todo}?sprintId=${sprintId}&page=${page}`).then(data=>
            store.dispatch(listTodo(data.sprintBacklogs, data.totalPages, page))
        );
    },
    getColumns: function () {
        return [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '估时',
            dataIndex: 'estimate',
            key: 'estimate'
        }, {
            title: 'Owner',
            dataIndex: 'user.name',
            key: 'user.name',
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeSprintBacklog(record));
                        this.refs.startDateFormModal.show();
                    }}>开始</a>
                    <span className="ant-divider"/>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeSprintBacklog(record));
                        this.refs.modal.show();
                    }}>编辑</a>
                    <span className="ant-divider"/>
                    <a href="#" onClick={()=>this.del(record.id)}>删除</a>
                </span>
            ),
        }];
    },
    add: function () {
        store.dispatch(changeSprintBacklog({sprintId: this.props.sprintId}));
        this.refs.modal.show();
    },
    del: function(id){
        if(confirm("确定要删除吗?")){
            Fetch.del(`${API_URL.sprintBacklog.del}${id}`).then(() => this.changePage());
        }
    },
    update: function () {
        this.changePage(1);
    },
    changeDoing: function () {
        this.changePage();
        this.props.changeDoing();
    },
    render: function() {
        return (
            <div>
                <Button type="primary" size="large" onClick={this.add}>新建</Button>
                <Table columns={this.getColumns()}
                       dataSource={this.props.todo.items}
                       pagination={{total: this.props.todo.totalPages, onChange:this.changePage}}/>
                <SprintBacklogFormModal sprintBacklog={this.props.sprintBacklog} reload={this.changePage} ref="modal" hiddenFields={['startDate','owner']}/>
                <StartDateFormModal sprintBacklog={this.props.sprintBacklog} reload={this.changeDoing} ref="startDateFormModal" />
            </div>
        )
    }
});

const Doing = React.createClass({
    changePage: function (page = 1) {
        this.loadData(page, this.props.sprintId);
    },
    componentDidMount: function() {
        this.loadData(1, this.props.sprintId);
    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.sprintId != this.props.sprintId){
            this.loadData(1, nextProps.sprintId);
        }
    },
    loadData: function (page = 1, sprintId) {
        Fetch.get(`${API_URL.sprintBacklog.doingOfSprint}?sprintId=${sprintId}&page=${page}`).then(data=>
            store.dispatch(listDoing(data.sprintBacklogs, data.totalPages, page))
        );
    },
    getColumns: function () {
        return [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '估时',
            dataIndex: 'estimate',
            key: 'estimate'
        }, {
            title: '开始时间',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        }, {
            title: '更新时间',
            dataIndex: 'updatedDate',
            key: 'updatedDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        }, {
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            render: (text) => (
                `${text}%`
            ),
        }, {
            title: 'Owner',
            dataIndex: 'user.name',
            key: 'user.name',
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeProgress({sprintBacklogId: record.id, sprintId: record.sprintId}));
                        this.refs.progressFormModal.show();
                    }}>更新进度</a>
                    <span className="ant-divider"/>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeSprintBacklog(record));
                        this.refs.modal.show();
                    }}>编辑</a>
                    <span className="ant-divider"/>
                    <a href="#" onClick={()=>this.del(record.id)}>删除</a>
                </span>
            ),
        }];
    },
    del: function(id){
        if(confirm("确定要删除吗?")){
            Fetch.del(`${API_URL.sprintBacklog.del}${id}`).then(() => this.changePage());
        }
    },
    update: function () {
        this.changePage(1);
    },
    render: function() {
        return (
            <div>
                <Table columns={this.getColumns()}
                       dataSource={this.props.doing.items}
                       pagination={{total: this.props.doing.totalPages, onChange:this.changePage}}/>
                <SprintBacklogFormModal sprintBacklog={this.props.sprintBacklog} reload={this.changePage} ref="modal" hiddenFields={[]}/>
                <ProgressFormModal ref="progressFormModal" progress={this.props.progress} reload={this.update}/>
            </div>
        )
    }
});

const Done = React.createClass({
    changePage: function (page = 1) {
        this.loadData(page, this.props.sprintId);
    },
    componentDidMount: function() {
        this.loadData(1, this.props.sprintId);
    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.sprintId != this.props.sprintId){
            this.loadData(1, nextProps.sprintId);
        }
    },
    loadData: function (page = 1, sprintId) {
        Fetch.get(`${API_URL.sprintBacklog.done}?sprintId=${sprintId}&page=${page}`).then(data=>
            store.dispatch(listDone(data.sprintBacklogs, data.totalPages, page))
        );
    },
    getColumns: function () {
        return [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '估时',
            dataIndex: 'estimate',
            key: 'estimate'
        },{
            title: '实际用时',
            key: 'actual',
            render: (text, record) => (
                ''
            ),
        }, {
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            render: (text) => (
                `${text}%`
            ),
        }, {
            title: '开始时间',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        }, {
            title: '完成时间',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        }, {
            title: 'Owner',
            dataIndex: 'user.name',
            key: 'user.name',
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeSprintBacklog(record));
                        this.refs.modal.show();
                    }}>更新完成时间</a>
                </span>
            ),
        }];
    },
    update: function () {
        this.changePage(1);
    },
    render: function() {
        return (
            <div>
                <Table columns={this.getColumns()}
                       dataSource={this.props.done.items}
                       pagination={{total: this.props.done.totalPages, onChange:this.changePage}}/>
                <EndDateFormModal sprintBacklog={this.props.sprintBacklog} reload={this.changePage} ref="modal" />
            </div>
        )
    }
});

let Kanban = React.createClass({
    changeDoing: function () {
        this.refs.doing.changePage();
    },
    render: function() {
        return (
            <div>
                <Tabs defaultActiveKey="2">
                    <Tabs.TabPane tab="待做" key="1">
                        <Todo sprintId={this.props.sprintId} todo={this.props.todo} sprintBacklog={this.props.sprintBacklog} changeDoing={this.changeDoing}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="正在进行" key="2">
                        <Doing ref="doing" sprintId={this.props.sprintId} doing={this.props.doing} sprintBacklog={this.props.sprintBacklog} progress={this.props.progress}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="已完成" key="3">
                        <Done sprintId={this.props.sprintId} sprintBacklog={this.props.sprintBacklog}　done={this.props.done}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="全部" key="4"><SprintBacklog sprintId={this.props.sprintId} /></Tabs.TabPane>
                </Tabs>
            </div>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        todo: store.kanbanState.todo,
        sprintBacklog: store.kanbanState.sprintBacklog,
        doing: store.kanbanState.doing,
        done: store.kanbanState.done,
        progress: store.kanbanState.progress
    };
};

Kanban = connect(mapStateToProps)(Kanban);

const KanbanModal = React.createClass({
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
            <Modal title="看板" visible={this.state.visible} onCancel={this.hide} width={1200} footer="">
                <Kanban sprintId={this.props.sprintId}/>
            </Modal>
        );
    }
});

export default KanbanModal;