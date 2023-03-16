const mongoose = require('mongoose')

const ReelSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    text: {
        type: String
    },
    media: {
        type: String
    },
    postType: {
        type: String
    },
    mimeType: {
        type:String
    },
    thumbnail_url:{
        type:String
    },
    likes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'user'
            }
        }
    ],
    comments:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            text:{
                type: String,
                required: true            
            },
            date:{
                type:Date,
                default: Date.now
            }
        }
    ],
    date:{
        type:Date,
        default: Date.now
    }
})

module.exports = Reels = mongoose.model('reel',ReelSchema)