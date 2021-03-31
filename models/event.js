const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eventSchema = new Schema({
    title:{
        type: 'string',
        require:true,
    },
    description:{
        type: 'string',
        require:true,
    },
    price:{
        type: 'number',
        require:true,
    },
    date:{
        type:'date',
        require:true,
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Event',eventSchema);