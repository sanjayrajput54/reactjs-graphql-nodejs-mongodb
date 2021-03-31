import React,{useContext} from 'react';
import {NavLink} from 'react-router-dom';
import './header.css';
import {useQuery,gql} from '@apollo/client';
import { useAuthToken,useLogout } from "../../graphql/auth";

const Navigation= (props)=>{
//   const IS_LOGGED_IN = gql`
//   query IsUserLoggedIn {
//     isLoggedIn @client
//   }
// `;
  // const { data } = useQuery(IS_LOGGED_IN);
  const [authToken] = useAuthToken();
  const logout = useLogout();


  return (<header className="main-nav">
  <div className="main-nav_logo">
    <h1>
Event Management 
</h1>
  </div>
  <nav className="main-nav_items">
    <ul>
        <li>
        <NavLink to="/event">Events</NavLink>
        </li>
        {authToken &&  <li>
          <NavLink to="/booking">Bookings</NavLink>
        </li>}
       {!authToken? <li>
          <NavLink to="/auth">Login</NavLink>
        </li>:<li>
          <button onClick={()=>logout()} type="button" >Logout</button>
        </li>}
    </ul>
</nav>
</header>)
}
export default Navigation;