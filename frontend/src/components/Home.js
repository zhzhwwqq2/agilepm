/**
 * Created by sunlong on 16/8/13.
 */
import React from "react";
import { Link } from 'react-router'
import SkyLight from 'react-skylight';
import Fetch from '../common/FetchIt';
import API_URL from "../common/url";
import Auth from '../common/Auth';
import "./home.less";
import "fg-select-css/src/select-css.css";


const Nav = React.createClass({
    getInitialState: function () {
        return {enterprise: ''}
    },
    handleChange: function (e) {
        this.setState({enterprise: e.target.value});
    },
    login: function () {
        let loginName = this.refs.loginName.value.trim();
        let password = this.refs.password.value.trim();
        Fetch.post(API_URL.user.login, {body:`loginName=${loginName}&password=${password}`}).then((token)=>{
            new Auth().login(token, true);
        });
    },
    register: function () {
        let enterprise = "个人";
        if(this.state.enterprise=='企业'){
            enterprise = this.refs.enterprise.value.trim()
        }
        let user = {
            name : this.refs.name.value.trim(),
            email : this.refs.email.value.trim(),
            password: this.refs.password.value.trim(),
            rePassword: this.refs.rePassword.value.trim(),
            enterprise: enterprise,
        };
        Fetch.postJSON(API_URL.user.register, {body: JSON.stringify({user: user})}).then((token)=>{
            new Auth().login(token, true);
        });
    },
    render: function() {
        var loginStyle = {
            width: '30%',
            height: '300px',
            marginTop: '-300px',
            marginLeft: '-15%',
        };
        var registerStyle = Object.assign({}, loginStyle, {height: '550px'});
        return (
            <div>
                <nav>
                    <Link to="/index.html" className="logo">Ala</Link>
                    <ul className="loginOrRegister">
                        <li><button type="button" onClick={() => this.refs.register.show()} className="registerBtn">免费注册</button></li>
                        <li><button type="button" onClick={() => this.refs.login.show()} className="loginBtn">登录</button></li>
                    </ul>
                    <ul>
                        <li><Link to="/product">产品</Link></li>
                        <li><Link to="/price">价格</Link></li>
                        <li><a href="#">社区</a></li>
                    </ul>
                </nav>
                <SkyLight dialogStyles={registerStyle} hideOnOverlayClicked ref="register" title="注册">
                    <form className="login">
                        <div className="custom-select"><select onChange={this.handleChange}><option value="个人">个人</option><option value="企业">企业</option></select></div>
                        <div className={this.state.enterprise=='企业'?'':'hidden'}><label>企业名称</label><input type="text" ref="enterprise" /></div>
                        <div><label>姓名</label><input type="text" ref="name" /></div>
                        <div><label>邮箱</label><input type="text" ref="email" /></div>
                        <div><label>密码</label><input type="password" ref="password" /></div>
                        <div><label>重复密码</label><input type="password" ref="rePassword" /></div>
                        <div><button type="button" className="btn" onClick={this.register}>注册</button></div>
                    </form>
                </SkyLight>
                <SkyLight dialogStyles={loginStyle}  hideOnOverlayClicked ref="login" title="登录">
                    <form className="login">
                        <div><label>邮箱</label><input type="text" ref="loginName" /></div>
                        <div><label>密码</label><input type="password" ref="password" /></div>
                        <div><button type="button" className="btn" onClick={this.login}>登录</button></div>
                    </form>
                </SkyLight>
            </div>
        )
    }
});


export const Product = React.createClass({
    render: function() {
        return (
            <div>
                <Nav/>
                <div className="feature">
                    <p>Ala敏捷项目管理工具四大特色</p>
                    <div>
                        <h3>看板</h3>
                        <p>了解每一项任务当前进展</p>
                        <img src=""/>
                    </div>
                    <div>
                        <h3>Backlog/Sprint/Sprint Backlog列表</h3>
                        <p>完美地支持Scrum</p>
                        <img src=""/>
                    </div>
                    <div>
                        <h3>燃尽图</h3>
                        <p>项目进度一目了然，轻松掌控全局</p>
                        <img src=""/>
                    </div>
                    <div>
                        <h3>日报/周报</h3>
                        <p>方便的导出项目周报，从此周报不再烦恼。提供定义日报/周报模板服务</p>
                        <img src=""/>
                    </div>
                    <button type="button"  className="btn">免费注册</button>
                </div>
            </div>
        )
    }
});

export const Price = React.createClass({
    render: function() {
        return (
            <div>
                <Nav/>
                <div className="priceDiv">
                    <div className="detail">
                        <h2>免费版</h2>
                        <p className="description">适用于个人或创业企业</p>
                        <p className="price">¥ 0</p>
                        <ul>
                            <li>看板</li>
                            <li>燃尽图</li>
                            <li>产品/Backlog/Sprint Backlog列表</li>
                            <li>日报/周报</li>
                            <li>用户数1~10人</li>
                            <li>无日报/周报模板定制</li>
                            <li>社区技术支持</li>
                        </ul>
                    </div>
                    <div className="detail">
                        <h2>企业版</h2>
                        <p className="description">适用于各种团队和企业</p>
                        <p className="price">¥ 999/年</p>
                        <ul>
                            <li>看板</li>
                            <li>燃尽图</li>
                            <li>产品/Backlog/Sprint Backlog列表</li>
                            <li>日报/周报</li>
                            <li>用户数不限</li>
                            <li>1次日报,1次周报模板定制</li>
                            <li>企业logo修改</li>
                            <li>专属顾问技术支持</li>
                        </ul>
                    </div>
                    <button type="button" className="btn">立即注册</button>
                </div>
            </div>
        )
    }
});

const Home = React.createClass({
    render: function() {
        return (
            <div>
                <Nav/>
                <div className="feature">
                    <p>免费、简洁、高效的敏捷项目管理工具，基于Scrum流程。是软件研发，互联网项目管理工具的好帮手，从此让工作有记录，让业绩有根据，再也不用担心我的周报了。</p>
                    <ul>
                        <li>看板<div>显示当前Sprint待做的，正在进行的和已经完成的Spring  Backlog。可以方便的更新进度</div></li>
                        <li>Backlog/Sprint/Sprint Backlog列表<div>完整的产品backlog和sprint backlog支持，更好的支持Scrum</div></li>
                        <li>燃尽图<div>项目进度一目了然，轻松掌控全局</div></li>
                        <li>日报/周报<div>方便的导出项目周报，从此周报不再烦恼。提供定义周报模板服务</div></li>
                    </ul>
                    <button type="button" className="btn">免费注册</button>
                </div>
            </div>
        )
    }
});

export default Home;