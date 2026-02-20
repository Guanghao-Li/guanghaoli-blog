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
    markdownEn: { type: String, default: "" },
    markdownZh: { type: String, default: "" },
    markdown: { type: String, default: undefined },
    uiSettings: UiSettingsSchema,
  },
  { _id: true, timestamps: false }
);

const Project =
  mongoose.models?.Project ?? mongoose.model("Project", ProjectSchema);

export async function getProjects() {
  await connectDB();
  return Project.find().sort({ id: 1 }).lean();
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
