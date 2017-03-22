import React from 'react';
import { WingBlank, WhiteSpace, ImagePicker, Button, Flex } from 'antd-mobile';
import Header from './Header';
import Classroom from  './Classroom';

const data = [{
    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
    id: '2121',
}, {
    url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
    id: '2122',
}];


export default class MyTest extends React.Component {

    state = {
        files: data,
    }
    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files,
        });
    }

    render() {
        const { files } = this.state;
        return (
            <div>
                <Header />
                <Classroom />
            </div>
        );
    }
}
