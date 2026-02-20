export type Lang = "en" | "zh";

export interface PersonalInfo {
  nameLabel: string;
  name: string;
  locationLabel: string;
  location: string;
  phoneLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
}

export interface EducationEntry {
  school: string;
  degree: string;
  period: string;
}

export interface WorkEntry {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface ProjectPlaceholder {
  title: string;
  desc: string;
  tags: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  education: EducationEntry[];
  work: WorkEntry[];
  projects: ProjectPlaceholder[];
  skills: string[];
}

const US_INFO: PersonalInfo = {
  nameLabel: "Name",
  name: "Guanghao Li",
  locationLabel: "Location",
  location: "Hoboken, NJ",
  phoneLabel: "Phone",
  phone: "+1 5513879325",
  emailLabel: "Email",
  email: "gli42@stevens.edu, liguanghao912@gmail.com",
};

const CN_INFO: PersonalInfo = {
  nameLabel: "姓名",
  name: "李光浩",
  locationLabel: "居住地",
  location: "湖北武汉",
  phoneLabel: "电话",
  phone: "+86 18976620394",
  emailLabel: "邮箱",
  email: "leegh2248@outlook.com",
};

// 教育经历：时间严格右对齐
const EDUCATION: EducationEntry[] = [
  {
    school: "Stevens Institute of Technology",
    degree: "Master of Engineering in Electrical Engineering",
    period: "2026.1 - 2027.1",
  },
  {
    school: "Hefei University of Technology",
    degree: "Bachelor of Science in Biomedical Engineering",
    period: "2020.9 - 2024.12",
  },
];

const WORK_EN: WorkEntry[] = [
  {
    company: "XX Hospital · Equipment Department",
    role: "Biomedical Engineer Intern",
    period: "2023.6 - 2023.9",
    bullets: [
      "Maintained and calibrated medical devices; assisted in equipment procurement.",
      "Documented device usage and maintenance records.",
    ],
  },
  {
    company: "XX Embedded Systems Co., Ltd.",
    role: "Software Development Intern",
    period: "2022.7 - 2022.10",
    bullets: [
      "Developed embedded firmware using C/C++; participated in hardware-software integration testing.",
      "Implemented data logging and debugging tools for IoT prototypes.",
    ],
  },
];

const WORK_ZH: WorkEntry[] = [
  {
    company: "XX 医院 · 设备科",
    role: "生物医学工程师实习",
    period: "2023.6 - 2023.9",
    bullets: [
      "负责医疗设备维护与校准，参与设备采购与验收流程。",
      "整理设备使用与维护记录文档。",
    ],
  },
  {
    company: "XX 嵌入式系统公司",
    role: "软件开发实习",
    period: "2022.7 - 2022.10",
    bullets: [
      "使用 C/C++ 开发嵌入式固件，参与软硬件联调测试。",
      "实现数据记录与调试工具，用于 IoT 原型开发。",
    ],
  },
];

const PROJECTS_EN: ProjectPlaceholder[] = [
  {
    title: "Full-stack Web Project",
    desc: "Full-stack application using Next.js and TypeScript.",
    tags: ["Next.js", "TypeScript", "React"],
  },
  {
    title: "IoT / Embedded Demo",
    desc: "Embedded system and IoT prototyping project.",
    tags: ["C/C++", "Embedded", "IoT"],
  },
];

const PROJECTS_ZH: ProjectPlaceholder[] = [
  {
    title: "全栈 Web 项目",
    desc: "基于 Next.js 与 TypeScript 的全栈应用。",
    tags: ["Next.js", "TypeScript", "React"],
  },
  {
    title: "IoT / 嵌入式 Demo",
    desc: "嵌入式系统与 IoT 原型开发项目。",
    tags: ["C/C++", "Embedded", "IoT"],
  },
];

const SKILLS_EN = [
  "Full-stack Development",
  "TypeScript",
  "React",
  "Next.js",
  "IoT",
  "Data Visualization",
  "C/C++",
];

const SKILLS_ZH = [
  "全栈开发",
  "TypeScript",
  "React",
  "Next.js",
  "IoT",
  "数据可视化",
  "C/C++",
];

export function getResumeData(lang: Lang): ResumeData {
  return {
    personal: lang === "zh" ? CN_INFO : US_INFO,
    education: EDUCATION,
    work: lang === "zh" ? WORK_ZH : WORK_EN,
    projects: lang === "zh" ? PROJECTS_ZH : PROJECTS_EN,
    skills: lang === "zh" ? SKILLS_ZH : SKILLS_EN,
  };
}
