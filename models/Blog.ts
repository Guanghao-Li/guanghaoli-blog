import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const BlogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    titleZh: { type: String, default: "" },
    description: { type: String, default: "" },
    descriptionZh: { type: String, default: "" },
    contentEn: { type: String, default: "" },
    contentZh: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    colSpan: { type: Number, default: 1 },
    rowSpan: { type: Number, default: 1 },
    order: { type: Number, default: 0 },
    readTime: { type: Number, default: 0 },
    pdfData: { type: String, default: "" },
    pdfName: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true, timestamps: false }
);

const Blog = mongoose.models?.Blog ?? mongoose.model("Blog", BlogSchema);

export async function getBlogs() {
  await connectDB();
  return Blog.find().sort({ order: 1, id: 1 }).lean();
}

export async function getBlogById(id: string) {
  await connectDB();
  return Blog.findOne({ id }).lean();
}

export async function replaceBlogs(blogs: any[]) {
  await connectDB();
  await Blog.deleteMany({});
  if (blogs.length > 0) {
    await Blog.insertMany(blogs);
  }
  return Blog.find().sort({ id: 1 }).lean();
}

export { Blog };
