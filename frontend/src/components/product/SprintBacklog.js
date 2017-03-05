import React from "react";
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from "../../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {listSprintBacklogs,} from "../../actions/sprintBacklogActions"
import { Table, Icon, Button, Modal, Form, Input,　DatePicker, Select } from 'antd';
const FormItem = Form.Item;
import "./sprintBacklog.less";

const SprintBacklog = React.createClass({
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
        Fetch.get(`${API_URL.sprintBacklog.list}?sprintId=${sprintId}&page=${page}`).then(data=>
            store.dispatch(listSprintBacklogs(data.sprintBacklogs, data.totalPages, page))
        );
    },
    getColumns: function () {
        return [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
        },{
            title: '开始时间',
            dataIndex: 'startDate',
            width: 160,
            key: 'startDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        },{
            title: '完成时间',
            dataIndex: 'endDate',
            width: 160,
            key: 'endDate',
            render: (text) => (
                text!=null?  `${moment(text).format("YYYY年MM月DD日 HH:mm:SS")}` : ''
            ),
        }, {
            title: '进度',
            dataIndex: 'progress',
            width: 100,
            key: 'progress',
            render: (text, record) => (
                text!=null ? `${text}%` : ''
            )
        }, {
            title: 'Owner',
            dataIndex: 'user.name',
            width: 60,
            key: 'user.name',
        }];
    },
    expandRow: function (record) {
        return <p>{record.story}</p>
    },
    render: function() {
        return (
            <div>
                <Table columns={this.getColumns()}
                       dataSource={this.props.sprintBacklogs}
                       expandedRowRender={this.expandRow}
                       rowKey='id'
                       pagination={{total: this.props.totalPages,　current:this.props.currentPage, onChange:this.changePage}}/>
            </div>
        )
    }
});

class SprintBacklogForm extends React.Component{
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
        let startDate = '',
            owner = '';
        if(this.props.hiddenFields.indexOf('startDate')==-1){
            startDate = <FormItem
                label="开始时间"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}>
                <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('startDate')} />
            </FormItem>
        }
        if(this.props.hiddenFields.indexOf('owner')==-1){
            const options = this.state.users.map(user => <Select.Option key={user.id} value={user.id}>{user.name}</Select.Option>);
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
                <Input {...getFieldProps('sprintId')} type="hidden"/>
                <FormItem
                    label="Name"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('name', {
                        rules: [{ required: true , message:'必填'},{max:50, message:'最多50个字符'}]
                    })} type="text"/>
                </FormItem>
                <FormItem
                    label="Importance"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('importance', {
                        rules: [{max: 10000, message:'请输入小于10000的整数', type:'integer', transform: value => value?Number(value):0}]
                    })} type="text"/>
                </FormItem>
                <FormItem
                    label="User Story"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('story', {
                        rules: [{ max:1000, message:'最多1000个字符'},]
                    })} type="textarea"/>
                </FormItem>
                <FormItem
                    label="How to demo"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('demo', {
                        rules: [{ max:1000, message:'最多1000个字符'},]
                    })} type="textarea"/>
                </FormItem>
                <FormItem
                    label="Notes"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('note', {
                        rules: [{ max:1000, message:'最多1000个字符'},]
                    })} type="textarea"/>
                </FormItem>
                <FormItem
                    label="估时"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('estimate', {
                        rules: [{min:0, max: 100, message:'请输入小于100的数字', type:'number', transform: value => value?Number(value):0}]
                    })} type="input"/>
                </FormItem>
                {startDate}
                {owner}
            </Form>
        );
    }
}

export const SprintBacklogFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if(this.props.sprintBacklog.id){
                this.update();
            }else{
                this.add();
            }
        });
    },
    add: function () {
        Fetch.postJSON(API_URL.sprintBacklog.add, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
            this.props.reload();
            this.hide();
        });
    },
    update: function () {
        Fetch.putJSON(`${API_URL.sprintBacklog.update}/${this.props.sprintBacklog.id}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
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
        let title = this.props.sprintBacklog.id? "修改Sprint Backlog":"添加Sprint Backlog";
        let _this = this;
        SprintBacklogForm = Form.create({
            mapPropsToFields() {
                let userId = _this.props.sprintBacklog.user ? _this.props.sprintBacklog.user.id : null;
                return {
                    id: {value: _this.props.sprintBacklog.id},
                    name: {value: _this.props.sprintBacklog.name},
                    story: {value: _this.props.sprintBacklog.story},
                    note: {value: _this.props.sprintBacklog.note},
                    importance: {value: _this.props.sprintBacklog.importance},
                    demo: {value: _this.props.sprintBacklog.demo},
                    estimate: {value: _this.props.sprintBacklog.estimate},
                    userId: {value: userId},
                    startDate: {value: _this.props.sprintBacklog.startDate},
                    sprintId: {value: _this.props.sprintBacklog.sprintId},
                };
            }
        })(SprintBacklogForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <SprintBacklogForm ref="form" hiddenFields={this.props.hiddenFields}/>
            </Modal>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        sprintBacklogs: store.sprintBacklogState.sprintBacklogs,
        sprintBacklog: store.sprintBacklogState.sprintBacklog,
        totalPages: store.sprintBacklogState.totalPages,
        currentPage: store.sprintBacklogState.currentPage,
    };
};

export default connect(mapStateToProps)(SprintBacklog);