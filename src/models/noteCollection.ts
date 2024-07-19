import { Schema, model } from "mongoose";
import Note from "./note.model";

const noteCollectionSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

let NoteCollection;
try {
  NoteCollection = model("NoteCollection");
} catch (error) {
  NoteCollection = model("NoteCollection", noteCollectionSchema);
}

export default NoteCollection;
