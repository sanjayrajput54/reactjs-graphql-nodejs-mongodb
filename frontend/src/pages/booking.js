import React,{useState} from 'react';
import {AgGridReact,AgGridColumn} from 'ag-grid-react';
import {useQuery, useLazyQuery,gql,useMutation} from '@apollo/client';
import Spinner from '../components/spinner';
import Moment from 'moment';
import {useLogout} from '../graphql/auth';
import Modal from '../components/event-modal';
import CreateBooking from './create-event';
const Bookings= (props)=>{
    const logout= useLogout();
    const [state,setState]=useState({
        isOpen:false,
    })
    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };
    const toggleModal = () => {
        setState({
          isOpen: !state.isOpen
        });
      }

      const handleSubmit=(bookingId)=>{
        handleAction({ variables: { bookingId: bookingId} });
    }
    const CANCEL_BOOKING = gql`
  mutation cancelBooking($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      _id,
      title, 
      description
      price
      date
    }
  }
`;

    const [handleAction,{loading :loadingCancelBooking}]=useMutation(CANCEL_BOOKING,
      {     
        onCompleted: (data) => {
          if(data && data){
            
          }
      },
        update(cache, { data: { cancelBooking } }) {
        cache.modify({
          fields: {
            bookings(existingNodes = [],{DELETE }) {
            return DELETE;
          }
          }
        });

      }
    }
      );
    



const FETCH_BOOKINGS=gql`query{ bookings {
    _id
    createdAt
    user{
        email
    }
    event{
        title
        description
        price
        creator{
          email
        }
    }
}
}`;
    const {loading, error,data } =useQuery(FETCH_BOOKINGS);
    if(error && error.message==='Response not successful: Received status code 500'){
       logout();
    }
    if(loading){
        return <Spinner/>
    }
    if(!(data && data.bookings)){
        return <div style={{height: "80vh", width: '100%'}}
        className="ag-theme-alpine"></div>
    }
    return(<React.Fragment>
        <Modal show={state.isOpen}
      onClose={toggleModal}>
    <CreateBooking onClose={toggleModal}></CreateBooking>
    </Modal>
    <div style={{height: "80vh", width: '100%'}}
className="ag-theme-alpine">
      {loadingCancelBooking && <Spinner/>}
       <AgGridReact style={{ width: '100%', height: '100%;' }}
           rowData={data.bookings}
           pagination={true}
           paginationAutoPageSize={true}
           defaultColDef={{filter: true}}
           frameworkComponents={{
            btnCellRenderer: (d)=><div className="add-event"><button onClick={()=>handleSubmit(d.data._id)}>Cancel Booking</button></div>
        }}
           // events
           onGridReady={onGridReady}>
        <AgGridColumn field="event.title" sortable={ true } filter={ true } checkboxSelection={ false } ></AgGridColumn>
        <AgGridColumn field="event.description" sortable={ true } filter={ true } ></AgGridColumn>
        <AgGridColumn field="event.price" sortable={ true } filter={ true }  ></AgGridColumn>
        <AgGridColumn field="CreatedBy" sortable={ true } filter={ true } 
                        valueGetter={(params)=>(params.data.user.email.split('@')[0])}

        ></AgGridColumn>

        <AgGridColumn
        valueGetter={(params)=>Moment(params.data.createdAt).format('DD MMM YYYY hh:mm A')}
        field="createdAt" sortable={ false } filter={ false }  ></AgGridColumn>
                        <AgGridColumn field="Event Creator"
                valueGetter={(params)=>(params.data.event.creator.email.split('@')[0])}

        ></AgGridColumn>
         <AgGridColumn   cellRenderer= 'btnCellRenderer'></AgGridColumn>

       </AgGridReact>
   </div></React.Fragment>)};
export default Bookings;
