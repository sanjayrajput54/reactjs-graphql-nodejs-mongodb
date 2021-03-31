import React,{useState} from 'react';
import './auth.css';
import Spinner from '../components/spinner';
import {useLazyQuery,useMutation,gql} from '@apollo/client';
import { useAuthToken } from "../graphql/auth";
import { useSnackbar } from 'react-simple-snackbar'

const Auth= (props)=>{
    const [_, setAuthToken, removeAuthtoken,userId,setUserId] = useAuthToken();
    const [openSnackbar, closeSnackbar] = useSnackbar()
    const [formState,setFormState]=useState({
        loading:false,
        isLogin:true,
        values:{},
        errors:{},
        touch:{}
    })
    const handleChange=(e)=>{
        e.preventDefault();
        const {value,name}=e.target;
        setFormState(pre=>({
            ...pre,
            values:{
                ...pre.values,
                [name]:value
            }
        }))
    }
    const switchLoginScreen=()=>{
        setFormState(pre=>({
            ...pre,
            isLogin:!pre.isLogin
        }))
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        const {values}=formState;
        if(values.email && values.email.trim() && values.password && values.password.trim()){
        if(formState.isLogin){
            removeAuthtoken();
            handleAction({ variables: { email: values.email,password: values.password} });
        }else{
            handleRegister({ variables: { email: values.email,password: values.password} });

        }
        }
       
    }

    const REGISTER_AUTHDATA = gql`
    mutation createUserRef($email: String!, $password:String!) {
        createUser(userInput:{email: $email,password:$password}) {
        _id
        email
      }
    }
  `;
const [handleRegister,{ loading:loadingReg}]=useMutation(REGISTER_AUTHDATA,{
    onCompleted: (data) => {
        if(data && data.createUser){
         openSnackbar("User Registered successfully");
        }
    },
    onError:(err) => {
        const { graphQLErrors, networkError }=err;
        let messageInfo=null;
        if (graphQLErrors){
          graphQLErrors.map(({ message, locations, path })=> {
            messageInfo=message;
            console.log(`[GraphQL error1]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            });
        }
        if(messageInfo){
            openSnackbar(messageInfo);
        }
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }
  });
    const FETCH_AUTHDATA = gql`
    query login_Ref($email: String!, $password:String!) {
        login(email: $email,password:$password) {
        userId
        token
      }
    }
  `;
const [handleAction,{ loading}]=useLazyQuery(FETCH_AUTHDATA,{
    onCompleted: (data) => {
        if(data && data.login.token){
        setAuthToken(data.login.token);
        setUserId(data.login.userId)
        }
    },
    onError:(err) => {
        const { graphQLErrors, networkError }=err;
        let messageInfo=null;
        openSnackbar("Please enter correct credential");

        if (graphQLErrors){
          graphQLErrors.map(({ message, locations, path })=> {
            messageInfo=message;
            console.log(`[GraphQL error1]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            });
        }
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }
  });

    return (<React.Fragment>{(loading || loadingReg)&& <Spinner/>}
  <form onSubmit={handleSubmit}
    className="auth-form" >
    <h3>{formState.isLogin?'Login':'Register'}</h3>
    <div className="form-control">
        <label>E-Mail</label>
        <input onChange={handleChange} type="email" name="email" />
    </div>
    <div className="form-control">
        <label >Password</label>
        <input onChange={handleChange} type="password" name="password" />
    </div>
    <div className="row ">
    <input type="submit" value="Submit"/>
  </div>
  <div className="row">
  <button type="button" className="switch-btn"onClick={switchLoginScreen} name="signup">{formState.isLogin?'Switch to Register':'Switch to Login'}</button>
  </div>
</form>
</React.Fragment>)};
export default Auth;