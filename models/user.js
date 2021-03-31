const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const userSchema= new Schema({
    email:{
        type: 'string',
        require:true,
    },
    password:{
        type: 'string',
    },
    addedEvents:[{
        type: Schema.Types.ObjectId,
        ref:'Event'
    }]
})

module.exports=mongoose.model('User',userSchema);