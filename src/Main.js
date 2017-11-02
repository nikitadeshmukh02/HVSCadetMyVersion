import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const Main = ({ token }) => {
  if (!token) {
    return <Redirect to="/login" />;
  }

  return <div> You are logged in.</div>;
};

const mapStateToProps = (state) => ({
  token: state.authState.token
});

export default connect(mapStateToProps)(Main);