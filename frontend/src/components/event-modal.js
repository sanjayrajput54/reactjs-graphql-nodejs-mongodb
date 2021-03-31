import React from 'react';
const Modal =props=>{
  // const [state,setState]= React.useState({});
   const handleClose=(e)=>{
        e.preventDefault();
        e.stopPropagation()
        // this.props.onClose()
    }
    if(!props.show) {
      return null;
    }
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingTop:'4%',
      zIndex:2
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: '55%',
      minHeight: '100%',
      margin: '0 0 auto auto',
      padding: 30
    };  

    return (
      <div className="backdrop" onClick={handleClose} style={backdropStyle}>
        <div className="modal" style={{...modalStyle,...props.modStyle}}>
          {props.children}
        </div>
      </div>
    );
}
export default Modal;
