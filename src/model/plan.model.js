import mongoose from 'mongoose'

const planSchema = new mongoose.Schema({
    id:{
        type:String
    },
    entity:{
        type:String
    },
    period:{
        type:String
    },
    item:{
        id:{
            type:String,
        },
        active:{
            type:Boolean
        },
        name:{
            type:String
        },
        description:{
            type:String
        },
        amount:{type:Number},
        type:{
            type:String
        }
    }
})

export const Plan = mongoose.model('plan',planSchema)