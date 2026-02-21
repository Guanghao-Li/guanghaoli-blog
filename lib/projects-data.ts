export interface ProjectUiSettings {
  titleSize?: string;
  titleLeftOffsetPercent?: number;
  contentWidthPercent?: number;
}

export interface Project {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  tags: string[];
  size: "large" | "medium";
  colSpan?: number;
  rowSpan?: number;
  order?: number;
  coverImage?: string;
  readTime?: number;
  createdAt?: string;
  updatedAt?: string;
  /** 英文 Markdown 正文 */
  markdownEn: string;
  /** 中文 Markdown 正文 */
  markdownZh: string;
  /** @deprecated 兼容旧数据，优先使用 markdownEn/markdownZh */
  markdown?: string;
  uiSettings?: ProjectUiSettings;
}

const MD_SAMPLE_1 = `
## 项目概述

基于 **Next.js** 与 **IoT** 的智能家居管理系统，支持多设备联动与场景编排。

### 技术栈

- Next.js 14 (App Router)
- TypeScript
- Framer Motion
- MQTT / WebSocket

### 核心功能

1. 设备发现与配对
2. 场景自动化编排
3. 实时状态同步

### 示例代码

\`\`\`typescript
const handleDeviceToggle = async (id: string) => {
  await fetch(\`/api/devices/\${id}/toggle\`, { method: 'POST' });
};
\`\`\`
`.trim();

const MD_SAMPLE_2 = `
## 设计系统组件库

可复用的 UI 组件库，遵循 **Apple HIG** 设计规范。

### 组件分类

- **Buttons** — 多种尺寸与变体
- **Cards** — Bento 风格布局
- **Forms** — 表单控件与校验

### 示例代码

\`\`\`tsx
<Button variant="primary" size="lg">
  Get Started
</Button>
\`\`\`
`.trim();

const MD_SAMPLE_3 = `
## 数据可视化 Dashboard

实时数据展示与图表分析，支持多数据源接入。

### 特性

- **Chart.js** 图表
- **WebSocket** 实时推送
- **Node.js** 后端 API

### 示例代码

\`\`\`javascript
const chart = new Chart(ctx, {
  type: 'line',
  data: { labels, datasets }
});
\`\`\`
`.trim();

const MD_SAMPLE_1_EN = `
## Overview

IoT-based smart home management system with multi-device linking and scene orchestration.

### Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Framer Motion
- MQTT / WebSocket

### Core Features

1. Device discovery and pairing
2. Scene automation
3. Real-time state sync

### Code Sample

\`\`\`typescript
const handleDeviceToggle = async (id: string) => {
  await fetch(\`/api/devices/\${id}/toggle\`, { method: 'POST' });
};
\`\`\`
`.trim();

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Smart Home Control Center",
    titleZh: "智能家居控制中心",
    description: "IoT-based smart home management system with multi-device linking and scene orchestration.",
    descriptionZh: "基于 Next.js 与 IoT 的智能家居管理系统，支持多设备联动与场景编排。",
    tags: ["Next.js", "TypeScript", "IoT", "Framer Motion"],
    size: "large",
    colSpan: 2,
    rowSpan: 1,
    order: 0,
    readTime: 5,
    markdownEn: MD_SAMPLE_1_EN,
    markdownZh: MD_SAMPLE_1,
  },
  {
    id: "2",
    title: "Design System Component Library",
    titleZh: "设计系统组件库",
    description: "Reusable UI component library following Apple HIG design guidelines.",
    descriptionZh: "可复用的 UI 组件库，遵循 Apple HIG 设计规范。",
    tags: ["React", "Tailwind", "Storybook"],
    size: "medium",
    colSpan: 1,
    rowSpan: 1,
    order: 1,
    readTime: 4,
    markdownEn: MD_SAMPLE_2,
    markdownZh: MD_SAMPLE_2,
  },
  {
    id: "3",
    title: "Data Visualization Dashboard",
    titleZh: "数据可视化 Dashboard",
    description: "Real-time data display and chart analysis with multi-source integration.",
    descriptionZh: "实时数据展示与图表分析，支持多数据源接入。",
    tags: ["Chart.js", "WebSocket", "Node.js"],
    size: "medium",
    colSpan: 1,
    rowSpan: 1,
    order: 2,
    readTime: 3,
    markdownEn: MD_SAMPLE_3,
    markdownZh: MD_SAMPLE_3,
  },
];
