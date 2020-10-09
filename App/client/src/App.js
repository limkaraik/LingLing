import React from 'react';
import { Route, Switch } from "react-router-dom";
//pages
import Login from './views/Authentication/Login'
import Register from './views/Authentication/Register'
import Home from './views/Home'
import Room from './views/Room/room'

function App() {
  return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Register} />
        <Route path="/" component={Home} />
        <Route path="/room/:pass" component={Room} />
      </Switch>
  );
}

export default App;
