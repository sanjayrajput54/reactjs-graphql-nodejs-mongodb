
const EventModel =require('../../models/event');
const UserModel = require('../../models/user');
const {dateToString} = require('../../helpers/date');
const user=async userId=>{
    try{
   const fetchUser= await UserModel.findById(userId);
    return ({
        ...fetchUser._doc,
         _id:fetchUser.id,
        addedEvents:events.bind(this,fetchUser._doc.addedEvents)})
}catch(err){
    throw err}
};

const events=async eventIds=>{
    try{
    const fetchEvents= await EventModel.find({_id:{$in:eventIds}});
    return fetchEvents.map((event)=>transformEvent(event));
    }
    catch(err){
        throw err;
    }
}
 const singleEvent = async (eventId) =>{
    try{
    const evt= await EventModel.findOne({_id:eventId});
    return transformEvent(evt);
    }
    catch(err){
        throw err;
    }
} 
 const transformEvent=event=>{
    return {
        ...event._doc,
        _id:event.id,
        date:dateToString(event.date),
        creator:user.bind(this,event.creator)
    }
}
 const transformBooking=booking=>{
    return {
        ...booking._doc,
        _id:booking.id,
        user:user.bind(this,booking._doc.user),
        event:singleEvent.bind(this,booking._doc.event),
        createdAt:dateToString(booking._doc.createdAt),
        updatedAt:dateToString(booking._doc.updatedAt)
    }
}

exports.singleEvent=singleEvent;
exports.transformBooking=transformBooking;
exports.transformEvent=transformEvent;