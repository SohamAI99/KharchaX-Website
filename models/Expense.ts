import mongoose, { Schema, Document, models } from "mongoose";

export interface IExpense extends Document {
  groupId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  paidBy: mongoose.Types.ObjectId;
  splitAmong: { user: mongoose.Types.ObjectId; amountOwed: number }[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    splitAmong: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amountOwed: { type: Number, required: true },
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Expense = models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
export default Expense;
