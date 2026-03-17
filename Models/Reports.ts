import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ReportSchema = new Schema({
    email: { type: String, require: true },
    username: { type: String, require: true },
    id: { type: String, require: true  },
    code: { type: String, require: true },
    response: {
      title: { type: String },
      code_explaination: { type: String },
      time_complexity: { type: String },
      space_complexity: { type: String },
      "Bug&Error": { type: [String], default: ["nothing found"] },
      optimization: { type: [String], default: ["no improvements found"] },
      scores: {
        maintainability: { type: Number, default: 0 },
        readability: { type: Number, default: 0 },
        performance: { type: Number, default: 0 },
        security: { type: Number, default: 0 },
      },
    },
    done: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: Date.now },
    saved: { type: Boolean, default: false },
    category: { type: String },

});


export default mongoose.models?.Report || model("Report", ReportSchema);