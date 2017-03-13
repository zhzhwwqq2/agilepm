import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router'
import { TabBar, Icon } from 'antd-mobile';

export default class AppBottom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
    };
  }

  renderContent(pageText) {
      switch (pageText) {
          case "我的练习":
              return (
                  <Link to="/mytest"></Link>
              );
              break;
          case "练习室":
              return (

                  <Link to="/index.html"></Link>
              );
              break;
          case "学分商城":
              return (

                  <Link to="/index.html"></Link>
              );
          default:
              return (

                  <Link to="/index.html"></Link>
              );
      }

  }

  render() {
    return (
        <div id="tab-bar" className="demo">
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        hidden={this.state.hidden}
      >
        <TabBar.Item
          title="我的练习"
          key="我的练习"
          icon={<Icon type={require('svg-sprite-loader!./svg/02.svg')}  size="md" color="blue" />}
          selectedIcon={require("./images/mytest_active.png")}
          selected={this.state.selectedTab === 'blueTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'blueTab',
            });
          }}
          data-seed="logId"
        >
          {this.renderContent('我的练习')}
        </TabBar.Item>
        <TabBar.Item
          icon={require("./images/classroom_normal.png")}
          selectedIcon={require("./images/classroom_active.png")}
          title="练习室"
          key="练习室"
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab',
            });
          }}
          data-seed="logId1"
        >
          {this.renderContent('练习室')}
        </TabBar.Item>
        <TabBar.Item
          icon={require("./images/shop_normal.png")}
          selectedIcon={require("./images/shop_active.png")}
          title="学分商城"
          key="学分商城"
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
            });
          }}
        >
          {this.renderContent('学分商城')}
        </TabBar.Item>
      </TabBar>
        </div>
    );
  }
}
