import { profile } from "console";
import mongoose from "mongoose";
import { title } from "process";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: { type: String, require: true },
    username: { type: String, require: true },
    profilepic: { type: String },
    name: { type: String },
    provider:{ type:String },
    history: [
        {
            id: { type: String, require: true  },
            title: { type: String },
            date: { type: String },
            saved: { type: Boolean, default: false },
        }
    ],
    saved: [
        {
            title: { type: String },
            date: { type: String },
            id: { type: String, require: true  },
        }
    ],
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: Date.now },

});


export default mongoose.models?.User || model("User", UserSchema);