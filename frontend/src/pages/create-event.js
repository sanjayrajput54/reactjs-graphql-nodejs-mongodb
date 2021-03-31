import React,{useState} from 'react';
import Spinner from '../components/spinner';
import Datetime from 'react-datetime';
import { gql, useMutation } from '@apollo/client';

const CreateEvent= (props)=>{
    

    const [formState,setFormState]=useState({
        loading:false,
        isLogin:true,
        values:{
          date:new Date()
        },
        errors:{},
        touch:{}
    })
    const handleChange=(e)=>{
      if(e & e.preventDefault)e.preventDefault()
        const {value,name}=e.target;
        setFormState(pre=>({
            ...pre,
            values:{
                ...pre.values,
                [name]:value
            }
        }))
    }
    const handleSubmit=(event)=>{
        const {values}=formState;
        handleAction({ variables: { title: values.title,description: values.description,price:parseFloat(values.price),date:values.date.toISOString()} });
        event.preventDefault();
    }
    const CREATE_EVENT = gql`
  mutation createEvent($title: String!, $description: String!,$price: Float!,$date:String!) {
    createEvent(eventInput: {title:$title, description:$description, price:$price, date:$date}) {
      _id,
      title, 
      description
      price
      date
    }
  }
`;

    const [handleAction,{loading}]=useMutation(CREATE_EVENT,
      { onError:(err) => {
        const { graphQLErrors, networkError }=err;
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
          );
      
        if (networkError) console.log(`[Network error]: ${networkError}`);
      },
        onCompleted: (data) => {
          if(data && data){
          props.onClose()
          }
      },
        update(cache, { data: { createEvent } }) {
        cache.modify({
          fields: {
            events(existingNodes = [],{readField}) {
              const newNodeRef = cache.writeFragment({
                data: createEvent,
                fragment: gql`
                  fragment eventsTest on Event {
                    _id
                    title
                    description
                    price
                    date
                  }
                `
              });
                // Quick safety check - if the new comment is already
      // present in the cache, we don't need to add it again.
      if (existingNodes.some(
        ref => readField('_id', ref) === createEvent._id
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
      let inputProps = {
        placeholder: 'Select Date & Time',
        // disabled: true
    };
return <div className="container">
{loading && <Spinner/>}
<form onSubmit={handleSubmit}>
  <div className="row">
    <div className="col-25">
      <label >Title</label>
    </div>
    <div className="col-75">
      <input type="text" onChange={handleChange} name="title" placeholder="Enter title"/>
    </div>
  </div>
  <div className="row">
    <div className="col-25">
      <label >Price</label>
    </div>
    <div className="col-75">
      <input type="number" onChange={handleChange}  name="price" placeholder="Enter price"/>
    </div>
  </div>
  <div className="row">
    <div className="col-25">
      <label for="eventtype">Event Type</label>
    </div>
    <div className="col-75">
      <select id="country" name="type">
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="self">Self</option>
      </select>
    </div>
  </div>
  <div className="row">
    <div className="col-25">
      <label >Date</label>
    </div>
    <div className="col-75">
    <Datetime 
    name="date"
    initialValue={new Date()}
    initialViewDate={new Date()}
        onChange={(d)=>handleChange({target:{value:d,name:'date'}})}
        value={formState.values['date']}
        inputProps={ inputProps }
      />
    </div>
  </div>
  <div className="row">
    <div className="col-25">
      <label >Description</label>
    </div>
    <div className="col-75">
      <textarea  name="description" onChange={handleChange} placeholder="Write description.."></textarea>
    </div>
  </div>
  <div className="row">
    <input type="submit" onClick={handleSubmit} value="Create"/>
    <input onClick={props.onClose} type="button" value="Cancel"/>
  </div>
  </form>
</div>
}
export default CreateEvent;