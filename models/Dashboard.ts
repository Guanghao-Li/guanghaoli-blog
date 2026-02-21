import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export type WidgetType = "hardware-stack" | "iot-monitor" | "pcb-showcase" | "github-stats";

const WidgetConfigSchema = new mongoose.Schema(
  {
    /** hardware-stack: { stack: string[] } */
    /** iot-monitor: { metricKey?: string } */
    /** pcb-showcase: { imageUrl?: string, title?: string } */
    /** github-stats: { username?: string, repo?: string } */
    stack: [String],
    metricKey: String,
    imageUrl: String,
    title: String,
    username: String,
    repo: String,
  },
  { _id: false, strict: false }
);

const WidgetSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["hardware-stack", "iot-monitor", "pcb-showcase", "github-stats"],
      required: true,
    },
    order: { type: Number, default: 0 },
    colSpan: { type: Number, default: 1 },
    rowSpan: { type: Number, default: 1 },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const DashboardSchema = new mongoose.Schema(
  {
    widgets: [WidgetSchema],
  },
  { _id: true, timestamps: false }
);

const Dashboard =
  mongoose.models?.Dashboard ?? mongoose.model("Dashboard", DashboardSchema);

export async function getDashboardDoc() {
  await connectDB();
  return Dashboard.findOne().lean();
}

export async function upsertDashboard(data: { widgets: any[] }) {
  await connectDB();
  const doc = await Dashboard.findOneAndUpdate(
    {},
    { $set: { widgets: data.widgets } },
    { upsert: true, new: true }
  ).lean();
  return doc;
}

export { Dashboard };
