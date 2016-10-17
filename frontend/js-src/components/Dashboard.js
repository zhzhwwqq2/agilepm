/**
 * Created by sunlong on 16/8/6.
 */
import React from "react";
import Fetch from '../common/FetchIt';
import store from '../store';
import API_URL from "../common/url";
import moment from 'moment';
import {connect} from "react-redux";
import {listProducts} from "../actions/productActions"
import {listSprints} from "../actions/sprintActions"
import {listSprintBacklogs, } from "../actions/sprintBacklogActions"
import { changeProgress } from "../actions/kanbanActions"
import { Table, Icon, Row, Col, Card, Button,notification } from 'antd';
import Header from "./common/Header";
import Auth from "../common/Auth";
import {Link} from "react-router";
import ProgressFormModal from "./product/ProgressFormModal";
import KanbanModal from "./product/Kanban";
import "./dashboard.less";

const VERSION = 2;

const Dashboard = React.createClass({
    componentDidMount: function() {
        new Auth().check();

        if(location.href.indexOf('dashboard.html')!=-1 && localStorage.version != VERSION){
            let description =
                <ol>
                    <li>优化<span className="red">backlog显示</span></li>
                    <li>添加backlog时，可以使用<span className="red">文本编辑器</span></li>
                    <li><span className="red">修复导出周报日期显示bug</span>,该bug主要由开始任务时未更新进度导致</li>
                </ol>;
            const args = {
                message: '更新提示',
                description: description,
                duration: 0,
                onClose: this.close
            };
            notification.open(args);
        }
    },
    close: function () {
        localStorage.version = VERSION;
    },
    render: function() {
        return (
            <div>
                <Header current="dashboard"/>
                <h2>概览</h2>
                <div className="dashboard">
                    <Row>
                        <Col span="9">
                            <ProductCard products={this.props.products}/>
                        </Col>
                        <Col span="15">
                            <SprintCard sprints={this.props.sprints}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <SprintBacklogCard sprintBacklogs={this.props.sprintBacklogs} progress={this.props.progress}/>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
});

const ProductCard = React.createClass({
    getInitialState: function () {
        return {count: 0}
    },
    componentDidMount: function() {
        this.loadData();
        this.countProduct();
    },
    loadData: function () {
        Fetch.get(API_URL.product.latest).then(data=>
            store.dispatch(listProducts(data.products, data.totalPages))
        );
    },
    countProduct: function () {
        Fetch.get(API_URL.product.count).then(data=>this.setState({count: data}));
    },
    getColumns: function () {
        return [{
            title: '产品名称',
            dataIndex: 'name',
            key: 'name'
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
                </span>
            ),
        }];
    },
    render: function() {
        return (
            <Card title="我负责的产品">
                <div>您总共负责了个 <span style={{color: 'red'}}>{this.state.count}</span> 产品,　以下是最新的5个产品:</div>
                <Table columns={this.getColumns()}
                       dataSource={this.props.products}
                       pagination={false} />
            </Card>
        )
    }
});

const SprintCard = React.createClass({
    getInitialState: function () {
        return {count: 0, sprintIds:[], sprintId: 0}
    },
    componentDidMount: function() {
        this.loadData(1);
        this.countSprint();
    },
    loadData: function (page = 1) {
        Fetch.get(`${API_URL.sprint.latest}`).then(data=>
            store.dispatch(listSprints(data.sprints, data.totalPages))
        );
    },
    countSprint: function () {
        Fetch.get(API_URL.sprint.count).then(data=>this.setState({count: data}));
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
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        this.setState({sprintId: record.id});
                        this.refs.kanbanModal.show();
                    }}>管理</a>
                    <span className="ant-divider"/>
                    <Link to={`/user/sprint?id=${record.productId}`}>详情</Link>
                </span>
            ),
        }];
    },
    exportDailyExcel: function () {
        location.href = `${API_URL.sprintBacklog.exportExcel}?sprintIds=${this.state.sprintIds}&access_token=${sessionStorage.token}`;
    },
    onChange: function (selectedRowKeys, selectedRows) {
        this.setState({sprintIds: selectedRowKeys});
    },
    render: function() {
        return (
            <Card title="我负责的Sprint">
                <div>您总共负责了 <span style={{color: 'red'}}>{this.state.count}</span> 个Sprint,　以下是正在进行的Sprint:</div>
                <Table columns={this.getColumns()}
                       dataSource={this.props.sprints}
                       rowSelection={{onChange: this.onChange}}
                       rowKey={record => record.id}
                       title={()=><Button size="large" onClick={this.exportDailyExcel}>导出日报</Button>}
                       pagination={false} />
                <KanbanModal sprintId={this.state.sprintId} ref="kanbanModal"/>
            </Card>
        )
    }
});

const SprintBacklogCard = React.createClass({
    getInitialState: function () {
        return {count: 0}
    },
    componentDidMount: function() {
        this.loadData();
        this.countSprintBacklog();
    },
    loadData: function () {
        Fetch.get(`${API_URL.sprintBacklog.doing}`).then(data=>
            store.dispatch(listSprintBacklogs(data, 0, 0))
        );
    },
    countSprintBacklog: function () {
        Fetch.get(API_URL.sprintBacklog.count).then(data=>this.setState({count: data}));
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
            title: '估时',
            dataIndex: 'estimate',
            width: 160,
            key: 'estimate',
        }, {
            title: '进度',
            dataIndex: 'progress',
            width: 100,
            key: 'progress',
        }, {
            title: '操作',
            key: 'operation',
            width: 120,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={()=>{
                        store.dispatch(changeProgress({sprintId: record.sprintId, sprintBacklogId: record.id}));
                        this.refs.progressFormModal.show();
                    }}>更新进度</a>
                </span>
            ),
        }];
    },
    render: function() {
        return (
            <Card title="我负责的Sprint Backlog">
                <div>您总共负责了个 <span style={{color: 'red'}}>{this.state.count}</span> 任务,　以下是正在进行中的任务:</div>
                <Table columns={this.getColumns()}
                       dataSource={this.props.sprintBacklogs}
                       pagination={false} />
                <ProgressFormModal ref="progressFormModal" progress={this.props.progress} reload={this.loadData}/>
            </Card>
        )
    }
});

const mapStateToProps = function(store) {
    return {
        products: store.productState.products,
        sprints: store.sprintState.sprints,
        sprintBacklogs: store.sprintBacklogState.sprintBacklogs,
        progress: store.kanbanState.progress,
    };
};

export default connect(mapStateToProps)(Dashboard);