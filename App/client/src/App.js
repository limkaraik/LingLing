import React from 'react';
import { Route, Switch } from "react-router-dom";
//pages
import Login from './views/Authentication/Login'
import Register from './views/Authentication/Register'
import Home from './views/Home'
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'

function App() {
  return (
      <Switch>
{/*        <Route path="/login" component={Login} />
        <Route path="/signup" component={Register} />
  <Route path="/" component={Home} />*/}
        <Route path="/" exact component={Join} />
        <Route path="/chat" component={Chat} />
      </Switch>
  );
}

export default App;
