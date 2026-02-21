import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const TelemetrySchema = new mongoose.Schema(
  {
    apiKey: { type: String, required: true, index: true },
    metricKey: { type: String, default: "default" },
    value: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    label: { type: String, default: "" },
  },
  { _id: true, timestamps: false }
);

const Telemetry =
  mongoose.models?.Telemetry ?? mongoose.model("Telemetry", TelemetrySchema);

export async function pushTelemetry(data: {
  apiKey: string;
  metricKey?: string;
  value: number;
  label?: string;
}) {
  await connectDB();
  const doc = await Telemetry.create({
    apiKey: data.apiKey,
    metricKey: data.metricKey ?? "default",
    value: data.value,
    label: data.label ?? "",
  });
  return doc;
}

export async function getTelemetry(
  apiKey: string,
  options?: { metricKey?: string; limit?: number; since?: Date }
) {
  await connectDB();
  const filter: any = { apiKey };
  if (options?.metricKey) filter.metricKey = options.metricKey;
  if (options?.since) filter.timestamp = { $gte: options.since };

  const docs = await Telemetry.find(filter)
    .sort({ timestamp: 1 })
    .limit(options?.limit ?? 500)
    .lean();

  return docs;
}

export async function clearTelemetry(apiKey?: string) {
  await connectDB();
  if (apiKey) {
    await Telemetry.deleteMany({ apiKey });
  } else {
    await Telemetry.deleteMany({});
  }
}

export { Telemetry };
