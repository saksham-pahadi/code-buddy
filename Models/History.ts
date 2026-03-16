import mongoose from "mongoose";
const { Schema, model } = mongoose;

const HistorySchema = new Schema({
    email: { type: String, require: true },
    username: { type: String, require: true },
    id: { type: String, require: true  },
    done: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: Date.now },
    saved: { type: Boolean, default: false },

});


export default mongoose.models?.History || model("History", HistorySchema);