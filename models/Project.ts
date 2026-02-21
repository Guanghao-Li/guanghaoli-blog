import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const UiSettingsSchema = new mongoose.Schema(
  {
    titleSize: String,
    titleLeftOffsetPercent: Number,
    contentWidthPercent: Number,
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    titleZh: { type: String, default: "" },
    description: { type: String, default: "" },
    descriptionZh: { type: String, default: "" },
    tags: [String],
    size: { type: String, enum: ["large", "medium"], default: "medium" },
    colSpan: { type: Number, default: 1 },
    rowSpan: { type: Number, default: 1 },
    order: { type: Number, default: 0 },
    coverImage: { type: String, default: "" },
    readTime: { type: Number, default: 0 },
    markdownEn: { type: String, default: "" },
    markdownZh: { type: String, default: "" },
    markdown: { type: String, default: undefined },
    uiSettings: UiSettingsSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true, timestamps: false }
);

const Project =
  mongoose.models?.Project ?? mongoose.model("Project", ProjectSchema);

export async function getProjects() {
  await connectDB();
  return Project.find().sort({ order: 1, id: 1 }).lean();
}

export async function replaceProjects(projects: any[]) {
  await connectDB();
  await Project.deleteMany({});
  if (projects.length > 0) {
    await Project.insertMany(projects);
  }
  return Project.find().sort({ id: 1 }).lean();
}

export { Project };
