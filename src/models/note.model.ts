import { Schema, model } from "mongoose";

const noteSchema = new Schema({
  note: { type: String, required: true },
  done: { type: Boolean, required: false, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

let Note;
try {
  // Check if the model is already defined
  Note = model("Note");
} catch (error) {
  // If model doesn't exist, define it
  Note = model("Note", noteSchema);
}
export default Note;
