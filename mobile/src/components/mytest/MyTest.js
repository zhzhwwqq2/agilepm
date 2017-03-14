import React from 'react';
import ReactDOM from 'react-dom';
import { WingBlank } from 'antd-mobile';
import Header from './header'
import {TextareaItemWrapper} from './TextareaItem'

export default class MyTest extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <Header/>
        <WingBlank size="md"><TextareaItemWrapper/></WingBlank>
      </div>
    );
  }
}
