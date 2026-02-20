import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const BasicInfoItemSchema = new mongoose.Schema(
  {
    id: String,
    labelEn: String,
    labelZh: String,
    valueEn: String,
    valueZh: String,
  },
  { _id: false }
);

const SectionItemSchema = new mongoose.Schema(
  {
    id: String,
    period: String,
    titleEn: String,
    titleZh: String,
    subtitleEn: String,
    subtitleZh: String,
    contentMarkdownEn: String,
    contentMarkdownZh: String,
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    id: String,
    titleEn: String,
    titleZh: String,
    order: Number,
    items: [SectionItemSchema],
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema(
  {
    nameEn: { type: String, default: "" },
    nameZh: { type: String, default: "" },
    basicInfo: [BasicInfoItemSchema],
    sections: [SectionSchema],
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
  basicInfo?: any[];
  sections?: any[];
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
