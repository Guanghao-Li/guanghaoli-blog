import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const IotSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    titleZh: { type: String, default: "" },
    description: { type: String, default: "" },
    descriptionZh: { type: String, default: "" },
  },
  { _id: true, timestamps: false }
);

const Iot = mongoose.models?.Iot ?? mongoose.model("Iot", IotSchema);

export async function getIotDoc() {
  await connectDB();
  return Iot.findOne().lean();
}

export async function upsertIot(data: {
  title?: string;
  titleZh?: string;
  description?: string;
  descriptionZh?: string;
}) {
  await connectDB();
  const doc = await Iot.findOneAndUpdate(
    {},
    { $set: data },
    { upsert: true, new: true }
  ).lean();
  return doc;
}

export { Iot };
