import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header'

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
      </div>
    );
  }
}
