
import React from 'react';
import {Switch,Route, Redirect,Router } from 'react-router-dom';
import EventPage from './pages/event';
import BookingPage from './pages/booking';
import AuthPage from './pages/auth';
import { useAuthToken } from "./graphql/auth";

const RoutesMapping=(props)=> {
  
    const [authToken] = useAuthToken()
    if(authToken){
        return <Switch>
         <Redirect  from="/" to="/event" exact="true" />
         <Redirect  from="/auth" to="/event" exact="true" />
         <Route path="/event" component={EventPage} />
         <Route path="/booking" component={BookingPage} />
       </Switch>
    }
    return <Switch>
         <Redirect  from="/" to="/auth" exact="true" />
         <Route path="/auth" component={AuthPage} />
          {/* {authToken && <Redirect  from="/auth" to="/event" exact="true" />} */}
          <Route path="/event" component={EventPage} />
          <Redirect  from="/booking" to="/auth" exact="true" />

          {/* {authToken && <Route path="/booking" component={BookingPage} />} */}
        </Switch>
  }
  export default RoutesMapping;