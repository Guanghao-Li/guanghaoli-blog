import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const HeroSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    nameZh: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    subtitleZh: { type: String, default: "" },
    avatar: { type: String, default: undefined },
    phoneEn: { type: String, default: "" },
    phoneZh: { type: String, default: "" },
    emailEn: { type: String, default: "" },
    emailZh: { type: String, default: "" },
    addressEn: { type: String, default: "" },
    addressZh: { type: String, default: "" },
    infoFontSize: { type: Number, default: 14 },
    infoPositionX: { type: Number, default: 0 },
    infoPositionY: { type: Number, default: 0 },
    emojiSize: { type: Number, default: 28 },
    minAngle: { type: Number, default: 45 },
    maxAngle: { type: Number, default: 135 },
    minVelocity: { type: Number, default: 5 },
    maxVelocity: { type: Number, default: 12 },
    gravity: { type: Number, default: 1 },
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
  phoneEn?: string;
  phoneZh?: string;
  emailEn?: string;
  emailZh?: string;
  addressEn?: string;
  addressZh?: string;
  infoFontSize?: number;
  infoPositionX?: number;
  infoPositionY?: number;
  emojiSize?: number;
  minAngle?: number;
  maxAngle?: number;
  minVelocity?: number;
  maxVelocity?: number;
  gravity?: number;
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
