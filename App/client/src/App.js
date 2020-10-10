import React from "react";
import { Route, Switch } from "react-router-dom";
//pages
import Login from "./views/Authentication/Login";
import Register from "./views/Authentication/Register";
import Home from "./views/Home";
import MeetingHistory from "./views/MeetingHistory/MeetingHistory";
import Meeting from "./views/Meeting/meeting";

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Register} />
      <Route path="/meeting" component={Meeting} />
      <Route path="/meetinghistory" component={MeetingHistory} />
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
