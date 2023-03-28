const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    message:{
        type:String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    type: {
        type: String
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    date:{
        type:Date,
        default: Date.now
    }
})

module.exports = Notifications = mongoose.model('notification',NotificationSchema)