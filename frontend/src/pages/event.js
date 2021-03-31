import React,{useState} from 'react';
import {AgGridReact,AgGridColumn} from 'ag-grid-react';
import {useQuery,gql} from '@apollo/client';
import Spinner from '../components/spinner';
import Moment from 'moment';
import Modal from '../components/event-modal';
import './event.css'
import CreateEvent from './create-event';
import BookEvent from './book-event';
import { useAuthToken } from "../graphql/auth";

const Events= (props)=>{
    const [authToken,,,userId] = useAuthToken()
    const [state,setState]=useState({
        isOpen:false,
        isBookEvent:false,
        event:null
    })
    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };
    const toggleModal = () => {
        setState(pre=>({
            ...pre,
            isOpen:!pre.isOpen
        }));
      }
      const toggleModalBookEvent = (event) => {
        setState(pre=>({
            ...pre,
            isBookEvent:!pre.isBookEvent,
            event:event
        }));
      }
const FETCH_EVENTS=gql`query{ events {
    _id
    title
    description
    date
    price
    creator{
        _id
        email
    }
}
}`;
    const {loading, error,data } =useQuery(FETCH_EVENTS);
    if(loading){
        return <Spinner/>
    }
    if(!(data && data.events)){
        return <div style={{height: "80vh", width: '100%'}}
        className="ag-theme-alpine"></div>
    }
    return(<React.Fragment>
            <Modal show={state.isOpen}
          onClose={toggleModal}>
        <CreateEvent onClose={toggleModal}></CreateEvent>
        </Modal>
        {state.isBookEvent &&<Modal show={state.isBookEvent}
             modStyle={{
                maxWidth: '40%',
                minHeight: '40%',
                margin: '0 auto auto auto',
                padding: 30
            }}
          onClose={toggleModalBookEvent}>
        <BookEvent 
        event={state.event} onClose={toggleModalBookEvent}></BookEvent>
        </Modal>}
        <div style={{height: "80vh", width: '100%'}}
    className="ag-theme-alpine">
{authToken && <div className="add-event">        <button onClick={toggleModal}>Create Event</button>
</div>}
       <AgGridReact 
            pagination={true}       
            paginationAutoPageSize={true}
            style={{ width: '100%', height: '100%;' }}
            rowData={data.events}
            frameworkComponents={{
            btnCellRenderer: (d)=><div className="add-event"><button onClick={()=>toggleModalBookEvent(d.data)}>Book Event</button></div>
        }
          }

           defaultColDef={{filter: true}}

           onGridReady={onGridReady}>
        <AgGridColumn field="title"
               
        sortable={ true } filter={ true } checkboxSelection={ false } ></AgGridColumn>
        <AgGridColumn
        
        field="description" sortable={ true } filter={ true } ></AgGridColumn>
        <AgGridColumn field="price" sortable={ true } filter={ true }  ></AgGridColumn>
        <AgGridColumn
        valueGetter={(params)=>Moment(params.data.date).format('DD MMM YYYY hh:mm A')}
        field="date" sortable={ false } filter={ false }  ></AgGridColumn>
                <AgGridColumn field="createdBy"
                valueGetter={(params)=>(params.data.creator._id===userId?'Self':params.data.creator.email.split('@')[0])}

        ></AgGridColumn>
    {authToken && <AgGridColumn   cellRenderer= 'btnCellRenderer'></AgGridColumn>}
       </AgGridReact>
   </div></React.Fragment>)};
export default Events;
