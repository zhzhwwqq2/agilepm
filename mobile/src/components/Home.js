/**
 * Created by sunlong on 16/8/13.
 */
import React from "react";
import { Link } from 'react-router'
import "./home.less";
import AppBottom from './appBottom'

export default class Home extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          这个是个例子
          <AppBottom/>
      </div>

    );
  }
}
