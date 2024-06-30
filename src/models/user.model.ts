import { Schema, model } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
});

let User;
try {
  // Check if the model is already defined
  User = model("User");
} catch (error) {
  // If model doesn't exist, define it
  User = model("User", userSchema);
}
export default User;
