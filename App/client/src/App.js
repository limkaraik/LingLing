import React from "react";
import { Route, Switch } from "react-router-dom";
import {Layout } from 'antd';
//pages
import Login from "./views/Authentication/Login";
import Register from "./views/Authentication/Register";
import Home from "./views/Home";
import MeetingHistory from "./views/MeetingHistory/MeetingHistory";
import Meeting from "./views/Meeting/meeting";
import NavBar from "./views/NavBar/NavBar";
import NavBarAuth from "./views/NavBar/NavBarAuth";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header>
        <Switch>
        <Route path="/login" component={NavBar} />
        <Route path="/signup" component={NavBar} />
        <Route path="/meeting" component={NavBarAuth} />
        <Route path="/meetinghistory" component={NavBarAuth} />
        <Route path="/" component={NavBarAuth} />
        </Switch>
      </Header>
      <Content>
        <div className="site-layout-content" >
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Register} />
          <Route path="/meeting" component={Meeting} />
          <Route path="/meetinghistory" component={MeetingHistory} />
          <Route path="/" component={Home} />
        </Switch>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2020 MOOZ</Footer>
      </Layout>
  );
}

export default App;
