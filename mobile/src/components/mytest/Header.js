/**
 * Created by samurai on 2017/3/10.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Flex, List, Button} from 'antd-mobile';
import HeaderPic from './HeaderPic'

export default class Header extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Flex className="flex-container">
         <Flex>
            <Flex.Item>
                <HeaderPic/>
                <div className="header-rank"><span>学习排名：100</span></div>
            </Flex.Item>
            <Flex.Item>
                <div className="header-name">淘宝 吴丹</div>
                <div className="header-name"><span>签到<em>1</em>天</span></div>
                <Button type="primary" inline size="small">inline small</Button>
            </Flex.Item>
         </Flex>
      </Flex>
    );
  }
}

