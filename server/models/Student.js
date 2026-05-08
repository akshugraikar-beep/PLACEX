import mongoose from "mongoose";
import User from "./User.js";

const INTERESTED_DOMAINS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "Software Tester / QA",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "UI/UX Designer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "Database Administrator",
  "Embedded Systems Engineer",
  "Business Analyst",
  "Other",
];

const studentSchema = new mongoose.Schema({
  university: { type: String, required: true },
  major: { type: String, required: true },
  interestedDomain: {
    type: String,
    enum: INTERESTED_DOMAINS,
    default: null,
  },
  placementStatus: { type: String, enum: ["Placed", "Not Placed"], default: "Not Placed" },
  interviewAttendance: { type: Number, default: 0 },
  resultStatus: { type: String, enum: ["Pass", "Fail"], default: "Fail" },
  department: { type: String },
  year: { type: String },
  semester: { type: String },
  attendance: { type: Number, default: 0 },
  passedInterviews: { type: Number, default: 0 },
  failedInterviews: { type: Number, default: 0 },
});

export { INTERESTED_DOMAINS };

const Student = User.discriminator("Student", studentSchema);

export default Student;

