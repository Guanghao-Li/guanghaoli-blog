import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const PaperStyleSchema = new mongoose.Schema(
  {
    maxWidth: { type: String, default: "max-w-4xl" },
    minHeight: { type: String, default: "min-h-[800px]" },
    theme: { type: String, enum: ["default", "blueprint"], default: "default" },
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema(
  {
    nameEn: { type: String, default: "" },
    nameZh: { type: String, default: "" },
    contentEn: { type: String, default: "" },
    contentZh: { type: String, default: "" },
    paperStyle: PaperStyleSchema,
    basicInfo: mongoose.Schema.Types.Mixed,
    sections: mongoose.Schema.Types.Mixed,
  },
  { _id: true, timestamps: false }
);

const Resume =
  mongoose.models?.Resume ?? mongoose.model("Resume", ResumeSchema);

export async function getResumeDoc() {
  await connectDB();
  return Resume.findOne().lean();
}

export async function upsertResume(data: {
  nameEn?: string;
  nameZh?: string;
  contentEn?: string;
  contentZh?: string;
  paperStyle?: { maxWidth?: string; minHeight?: string; theme?: string };
  basicInfo?: any;
  sections?: any;
}) {
  await connectDB();
  const doc = await Resume.findOneAndUpdate(
    {},
    { $set: data },
    { upsert: true, new: true }
  ).lean();
  return doc;
}

export { Resume };
