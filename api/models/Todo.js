import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "done"],
      default: "todo",
    },
    assigner: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    assignee: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model("Todo", TodoSchema);
