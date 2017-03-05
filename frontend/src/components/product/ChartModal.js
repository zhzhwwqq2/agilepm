/**
 * Created by sunlong on 16/8/12.
 */
import React from "react";
import Fetch from '../../common/FetchIt';
import { Modal } from 'antd';
import API_URL from "../../common/url";
import Chart from 'chart.js'

const SprintChart = React.createClass({
    loadData: function () {
        Fetch.get(`${API_URL.sprint.status}?id=${this.props.sprintId}`).then(data => {
            this.generateChart(data);
        });
    },
    generateChart: function (data) {
        new Chart(this.refs.myChart, {
            type: 'line',
            data: {
                labels: data.days,
                datasets: [{
                    label: "计划时间",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data.plan,
                    spanGaps: false,
                }, {
                    label: "实际时间",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(255, 99, 132, 0.4)",
                    borderColor: "rgba(255,99,132,1)",
                    borderCapStyle: 'butt',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(255,99,132,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255,99,132,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data.fact,
                    spanGaps: false,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    },
    componentDidMount: function () {
        this.loadData();
    },
    render: function() {
        return (
            <canvas ref="myChart" />
        );
    }
});

const ChartModal = React.createClass({
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
            <Modal title="燃尽图" visible={this.state.visible} onOk={this.submit} onCancel={this.hide} width="850" height="500" footer="">
                <SprintChart sprintId={this.props.sprintId}/>
            </Modal>
        );
    }
});

export default ChartModal;