/**
 * Created by sunlong on 16/8/13.
 */
import React from "react";
import { Link } from 'react-router'
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
          <AppBottom/>
      </div>

    );
  }
}
