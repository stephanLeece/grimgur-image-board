import React from 'react';
import {Link, browserHistory} from 'react-router';
// import axios from '../axios';
// import {getSocket} from '../socket';

export class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (

<div className='main' id='landing'>



<img id='bigLogo' src="/images/logoFull.png" alt=""/>


<img id='landingImage' src="/images/landingLong.png" alt=""/>

<h2>beacon connects volunteers with charities and non-profits across the world.</h2>
<div><Link to="/register">Register</Link> or <Link to="/login">Login</Link> to get started.</div>

</div>


    )
  }
}
