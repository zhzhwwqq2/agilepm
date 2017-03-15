import React from 'react';
import ReactDOM from 'react-dom';
import { WingBlank ,WhiteSpace,ImagePicker,Button ,Flex } from 'antd-mobile';
import Header from './header'
import {TextareaItemWrapper} from './TextareaItem'

const data = [{
    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
    id: '2121',
}, {
    url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
    id: '2122',
}];


export default class MyTest extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };
    state = {
        files: data,
    }
    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files,
        });
    }

  constructor(props) {
    super(props);
  }

  render() {
      const { files } = this.state;
    return (
      <div>
          <Header/>
        <WingBlank size="md"><TextareaItemWrapper/></WingBlank>
        <Flex style={{ marginBottom: '0.16rem' }}>
          <Button type="primary" inline style={{ marginRight: '0.08rem' }}>inline</Button>
          <Button type="ghost" inline size="small" style={{ marginRight: '0.08rem' }}>inline small</Button>
          <Button type="primary" inline size="small">inline small</Button>
        </Flex>
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <p>safdsfsafasf</p>
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <p>safdsfsafasf</p>
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <p>safdsfsafasf</p>
        <p>safdsfsafasf</p>
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <p>safdsfsafasf</p>
        <p>safdsfsafasf</p>
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <p>safdsfsafasf</p>
        <p>safdsfsafasf</p>
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <p>safdsfsafasf</p>
        <p>safdsfsafasf</p>
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <WhiteSpace size="xs" />
        <p>safdsfsafasf</p>
        <div>
          <ImagePicker
              files={files}
              onChange={this.onChange}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={files.length < 5}
          />
        </div>
      </div>
    );
  }
}
