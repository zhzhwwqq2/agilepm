/**
 * Created by sunlong on 16/7/25.
 */
import React from "react";
import {Link} from "react-router";
import {Menu, Icon} from "antd";

const ProductSidebar = React.createClass({
    handleClick(e) {
        this.setState({
            current: e.key,
        });
    },
    render() {
        return (
            <Menu onClick={this.handleClick}
                  selectedKeys={[this.props.current]}
                  mode="vertical"
            >
                <Menu.Item key="backlog">
                    <Link to={{pathname:"/user/backlog", query:{id: this.props.productId}}}>Backlog管理</Link>
                </Menu.Item>
                <Menu.Item key="sprint">
                    <Link to={{pathname:"/user/sprint", query:{id: this.props.productId}}}>Sprint管理</Link>
                </Menu.Item>
            </Menu>
        );
    },
});

export default ProductSidebar;