import mongoose, { Schema } from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    job: { type: Schema.Types.ObjectId, ref: "Jobs" },
    cover_letter: { type: String },
    cv: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Rejected", "Shortlisted"],
      default: "Pending",
    },
    expectedSalary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Applications = mongoose.model("Applications", applicationSchema);

export default Applications;
