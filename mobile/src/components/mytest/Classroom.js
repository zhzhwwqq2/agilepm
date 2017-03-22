/**
 * Created by Administrator on 2017/3/22 0022.
 */
import React from 'react';
import { ListView, Card, WhiteSpace, WingBlank, Flex } from 'antd-mobile';
import Fetch from '../../common/FetchIt';

require('./classroom.less');

let datas = [];
let index;

const NUM_ROWS = 20;
let pageIndex = 0;


export default class Classroom extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.genData = (pIndex = 0) => {
            const dataBlob = {};
            for (let i = 0; i < NUM_ROWS; i++) {
                const ii = (pIndex * NUM_ROWS) + i;
                dataBlob[`${ii}`] = `row - ${ii}`;
            }
            return dataBlob;
        };

        this.state = {
            dataSource: dataSource.cloneWithRows({}),
            isLoading: true,
            showPicable: false,
            list: [],
        };
    }

    loadData() {
        Fetch.get('http://192.168.1.103:3000/posts/2').then(data => {
            console.log('data===== ', data);
            // this.setState({ list: data });
            datas = data;
            index = datas.length - 1 ;
        });
    }

    componentDidMount() {
        this.loadData();
        setTimeout(() => {
            this.rData = this.genData();
            console.log('this.rData ======= ', this.rData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
        }, 600);
    }


    onEndReached = event => {
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.rData = { ...this.rData, ...this.loadData(++pageIndex) };
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
        }, 1000);
    }

    render() {
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`} style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = datas.length - 1;
            }
            console.log("datas========= ",datas);
            const obj = datas[index--];
            console.log("obj========= ",obj);
            return (
                <div key={rowID} className="row">
                    <div className="row-title">{obj.title}</div>
                    <div style={{ display: '-webkit-box', display: 'flex', padding: '0.3rem 0' }}>
                        <img style={{ height: '1.28rem', marginRight: '0.3rem' }} src={obj.img} />
                        <div className="row-text">
                            <div style={{ marginBottom: '0.16rem', fontWeight: 'bold' }}>{obj.des}</div>
                            <div><span style={{ fontSize: '0.6rem', color: '#FF6E27' }}>{rowID}</span>元/任务</div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div id="classroomContent">
                <ListView
                    ref="lv"
                    dataSource={this.state.dataSource}
                    renderHeader={() => <div className="classroom-header">
                        <div className="title">
                            <p>昂立小天使每日一练</p>
                            <p>轻松赢礼品</p>
                        </div>
                    </div>}
                    renderFooter={() => <div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? '加载中...' : '加载完毕'}
                    </div>}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={4}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    onScroll={() => { console.log('scroll'); }}
                    useBodyScroll
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                />
            </div>
        );
    }
}
