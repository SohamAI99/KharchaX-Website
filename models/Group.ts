import mongoose, { Schema, Document, models } from "mongoose";

export interface IGroup extends Document {
  name: string;
  mode: "Trip" | "Party" | "Flatmate";
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  budget?: number;
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
  },
  { timestamps: true }
);

const Group = models.Group || mongoose.model<IGroup>("Group", GroupSchema);
export default Group;
