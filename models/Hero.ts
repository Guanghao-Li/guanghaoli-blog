import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const HeroSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    nameZh: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    subtitleZh: { type: String, default: "" },
    avatar: { type: String, default: undefined },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    infoFontSize: { type: Number, default: 14 },
    infoPositionX: { type: Number, default: 0 },
    infoPositionY: { type: Number, default: 0 },
  },
  { _id: true, timestamps: false }
);

const Hero =
  mongoose.models?.Hero ?? mongoose.model("Hero", HeroSchema);

export async function getHeroDoc() {
  await connectDB();
  return Hero.findOne().lean();
}

export async function upsertHero(data: {
  name?: string;
  nameZh?: string;
  subtitle?: string;
  subtitleZh?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  address?: string;
  infoFontSize?: number;
  infoPositionX?: number;
  infoPositionY?: number;
}) {
  await connectDB();
  const doc = await Hero.findOneAndUpdate(
    {},
    { $set: data },
    { upsert: true, new: true }
  ).lean();
  return doc;
}

export { Hero };
