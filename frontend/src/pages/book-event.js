import React,{useState} from 'react';
import Spinner from '../components/spinner';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {useLogout} from '../graphql/auth';

const BookEvent= (props)=>{
  const history = useHistory();
  const handleNavigation = () => history.push('/booking');
  const logout= useLogout();

    const [formState,setFormState]=useState({
        loading:false,
        isLogin:true,
        values:{},
        errors:{},
        touch:{}
    })

    const handleSubmit=(event)=>{
        const {values}=formState;
        handleAction({ variables: { eventId:props.event._id} });
        event.preventDefault();
    }
    const BOOK_EVENT = gql`
  mutation bookEvent($eventId:ID!) {
    bookEvent(eventId:$eventId) {
      _id, 
      createdAt
      user{
        email
      }
      event{
        title
        description
        price
      }
    }
  }
`;

    const [handleAction,{loading, error:errorBookEvent}]=useMutation(BOOK_EVENT,
      {
        onError:(err) => {
          const { graphQLErrors, networkError }=err;
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            );
        
          if (networkError) console.log(`[Network error]: ${networkError}`);
        },
        onCompleted: (data) => {
        if(data && data){
        props.onClose();
        handleNavigation();
        }
      console.log(data);
    },
    update(cache, { data: { bookEvent },error }) {
        cache.modify({
          fields: {
            bookings(existingNodes = [],{readField}) {
              const newNodeRef = cache.writeFragment({
                data: bookEvent,
                fragment: gql`
                  fragment bookNewEvent on Booking {
                    _id
                    createdAt
                    user{
                        email
                    }
                    event{
                        title
                        description
                        price
                    }
                  }
                `
              });
                // Quick safety check - if the new comment is already//
      // present in the cache, we don't need to add it again.
      if (existingNodes.some(
        ref => readField('_id', ref) === bookEvent._id
      )) {
        return existingNodes;
      }
    return [...existingNodes, newNodeRef];
          }
          }
        });
      }
    }
      );
      if(errorBookEvent && errorBookEvent.message==='Response not successful: Received status code 500'){
        logout();
     }
return <div className="container">
{loading && <Spinner/>}
<form onSubmit={handleSubmit}>
  <div className="row">
    <div className="col-75">
      <label >You are booking on : <b>{props.event.title}</b> event</label>
    </div>
  </div>
  <div className="row">
    <input type="submit" onClick={handleSubmit} value="Book Event"/>
    <input onClick={props.onClose} type="button" value="Cancel"/>
  </div>
  </form>
</div>
}
export default BookEvent;