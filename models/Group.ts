import mongoose, { Schema, Document, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IGroup extends Document {
  name: string;
  mode: "Trip" | "Party" | "Flatmate";
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  budget?: number;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    mode: { type: String, enum: ["Trip", "Party", "Flatmate"], default: "Trip" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    budget: { type: Number },
    inviteCode: { type: String, unique: true, default: uuidv4 },
  },
  { timestamps: true }
);

const Group = models.Group || mongoose.model<IGroup>("Group", GroupSchema);
export default Group;
