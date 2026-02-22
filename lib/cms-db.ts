import type { CmsData } from "./data-store";
import { DEFAULT_DATA } from "./data-store";
import { getHeroDoc, upsertHero } from "@/models/Hero";
import { getResumeDoc, upsertResume } from "@/models/Resume";
import { getProjects, replaceProjects } from "@/models/Project";
import { getBlogs, replaceBlogs } from "@/models/Blog";
import { getIotDoc, upsertIot } from "@/models/Iot";
import { getDashboardDoc, upsertDashboard } from "@/models/Dashboard";

function toHeroPayload(hero: CmsData["hero"]) {
  return {
    name: hero?.name ?? DEFAULT_DATA.hero.name,
    nameZh: hero?.nameZh ?? DEFAULT_DATA.hero.nameZh,
    subtitle: hero?.subtitle ?? DEFAULT_DATA.hero.subtitle,
    subtitleZh: hero?.subtitleZh ?? DEFAULT_DATA.hero.subtitleZh,
    ...(hero?.avatar !== undefined && { avatar: hero.avatar }),
    phoneEn: hero?.phoneEn ?? "",
    phoneZh: hero?.phoneZh ?? "",
    emailEn: hero?.emailEn ?? "",
    emailZh: hero?.emailZh ?? "",
    addressEn: hero?.addressEn ?? "",
    addressZh: hero?.addressZh ?? "",
    infoFontSize: hero?.infoFontSize ?? 14,
    infoPositionX: hero?.infoPositionX ?? 0,
    infoPositionY: hero?.infoPositionY ?? 0,
    emojiSize: hero?.emojiSize ?? 28,
    minAngle: hero?.minAngle ?? 45,
    maxAngle: hero?.maxAngle ?? 135,
    minVelocity: hero?.minVelocity ?? 5,
    maxVelocity: hero?.maxVelocity ?? 12,
    gravity: hero?.gravity ?? 0.05,
    friction: hero?.friction ?? 0.96,
  };
}

function toResumePayload(resume: CmsData["resume"]) {
  return {
    nameEn: resume?.nameEn ?? DEFAULT_DATA.resume.nameEn,
    nameZh: resume?.nameZh ?? DEFAULT_DATA.resume.nameZh,
    contentEn: resume?.contentEn ?? DEFAULT_DATA.resume.contentEn,
    contentZh: resume?.contentZh ?? DEFAULT_DATA.resume.contentZh,
    paperStyle: resume?.paperStyle ?? DEFAULT_DATA.resume.paperStyle,
    infoFontSize: resume?.infoFontSize ?? 14,
    infoPositionX: resume?.infoPositionX ?? 0,
    infoPositionY: resume?.infoPositionY ?? 0,
  };
}

function toProjectsPayload(projects: CmsData["projects"]) {
  const now = new Date();
  return (projects ?? DEFAULT_DATA.projects).map((p) => ({
    id: p.id,
    title: p.title ?? "",
    titleZh: p.titleZh ?? "",
    description: p.description ?? "",
    descriptionZh: p.descriptionZh ?? "",
    tags: p.tags ?? [],
    size: p.size ?? "medium",
    colSpan: p.colSpan ?? 1,
    rowSpan: p.rowSpan ?? 1,
    order: p.order ?? 0,
    coverImage: p.coverImage ?? "",
    readTime: p.readTime ?? 0,
    pdfData: p.pdfData ?? "",
    pdfName: p.pdfName ?? "",
    markdownEn: p.markdownEn ?? p.markdown ?? "",
    markdownZh: p.markdownZh ?? p.markdown ?? "",
    ...(p.uiSettings && { uiSettings: p.uiSettings }),
    createdAt: p.createdAt ? new Date(p.createdAt) : now,
    updatedAt: now,
  }));
}

function toIotPayload(iot: CmsData["iot"]) {
  return {
    title: iot?.title ?? DEFAULT_DATA.iot.title,
    titleZh: iot?.titleZh ?? DEFAULT_DATA.iot.titleZh,
    description: iot?.description ?? DEFAULT_DATA.iot.description,
    descriptionZh: iot?.descriptionZh ?? DEFAULT_DATA.iot.descriptionZh,
    chartConfig: iot?.chartConfig ?? DEFAULT_DATA.iot.chartConfig ?? {},
  };
}

function toBlogsPayload(blogs: CmsData["blogs"]) {
  const now = new Date();
  return (blogs ?? DEFAULT_DATA.blogs).map((b) => ({
    id: b.id,
    title: b.title ?? "",
    titleZh: b.titleZh ?? "",
    description: b.description ?? "",
    descriptionZh: b.descriptionZh ?? "",
    contentEn: b.contentEn ?? "",
    contentZh: b.contentZh ?? "",
    coverImage: b.coverImage ?? "",
    colSpan: b.colSpan ?? 1,
    rowSpan: b.rowSpan ?? 1,
    order: b.order ?? 0,
    readTime: b.readTime ?? 0,
    pdfData: b.pdfData ?? "",
    pdfName: b.pdfName ?? "",
    createdAt: b.createdAt ? new Date(b.createdAt) : now,
    updatedAt: now,
  }));
}

function toDashboardPayload(dashboard: CmsData["dashboard"]) {
  return {
    widgets: (dashboard?.widgets ?? DEFAULT_DATA.dashboard.widgets).map((w) => ({
      id: w.id,
      type: w.type,
      order: w.order ?? 0,
      colSpan: w.colSpan ?? 1,
      rowSpan: w.rowSpan ?? 1,
      config: w.config ?? {},
    })),
  };
}

export async function loadCmsData(): Promise<CmsData> {
  const [heroDoc, resumeDoc, projectDocs, blogDocs, iotDoc, dashboardDoc] = await Promise.all([
    getHeroDoc(),
    getResumeDoc(),
    getProjects(),
    getBlogs(),
    getIotDoc(),
    getDashboardDoc(),
  ]);

  const hero = heroDoc
    ? {
        name: heroDoc.name ?? DEFAULT_DATA.hero.name,
        nameZh: heroDoc.nameZh ?? DEFAULT_DATA.hero.nameZh,
        subtitle: heroDoc.subtitle ?? DEFAULT_DATA.hero.subtitle,
        subtitleZh: heroDoc.subtitleZh ?? DEFAULT_DATA.hero.subtitleZh,
        ...(heroDoc.avatar && { avatar: heroDoc.avatar }),
        phoneEn: heroDoc.phoneEn ?? heroDoc.phone ?? "",
        phoneZh: heroDoc.phoneZh ?? heroDoc.phone ?? "",
        emailEn: heroDoc.emailEn ?? heroDoc.email ?? "",
        emailZh: heroDoc.emailZh ?? heroDoc.email ?? "",
        addressEn: heroDoc.addressEn ?? heroDoc.address ?? "",
        addressZh: heroDoc.addressZh ?? heroDoc.address ?? "",
        infoFontSize: heroDoc.infoFontSize ?? 14,
        infoPositionX: heroDoc.infoPositionX ?? 0,
        infoPositionY: heroDoc.infoPositionY ?? 0,
        emojiSize: heroDoc.emojiSize ?? 28,
        minAngle: heroDoc.minAngle ?? 45,
        maxAngle: heroDoc.maxAngle ?? 135,
        minVelocity: heroDoc.minVelocity ?? 5,
        maxVelocity: heroDoc.maxVelocity ?? 12,
        gravity: heroDoc.gravity ?? 0.05,
        friction: heroDoc.friction ?? 0.96,
      }
    : DEFAULT_DATA.hero;

  const resume = resumeDoc
    ? {
        nameEn: resumeDoc.nameEn ?? DEFAULT_DATA.resume.nameEn,
        nameZh: resumeDoc.nameZh ?? DEFAULT_DATA.resume.nameZh,
        contentEn: resumeDoc.contentEn ?? DEFAULT_DATA.resume.contentEn,
        contentZh: resumeDoc.contentZh ?? DEFAULT_DATA.resume.contentZh,
        paperStyle: resumeDoc.paperStyle ?? DEFAULT_DATA.resume.paperStyle,
        infoFontSize: resumeDoc.infoFontSize ?? 14,
        infoPositionX: resumeDoc.infoPositionX ?? 0,
        infoPositionY: resumeDoc.infoPositionY ?? 0,
      }
    : DEFAULT_DATA.resume;

  const projects =
    projectDocs && projectDocs.length > 0
      ? projectDocs.map((p: any) => {
          const { _id, ...rest } = p;
          return {
            id: rest.id,
            title: rest.title ?? "",
            titleZh: rest.titleZh ?? "",
            description: rest.description ?? "",
            descriptionZh: rest.descriptionZh ?? "",
            tags: rest.tags ?? [],
            size: (rest.size as "large" | "medium") ?? "medium",
            colSpan: rest.colSpan ?? 1,
            rowSpan: rest.rowSpan ?? 1,
            order: rest.order ?? 0,
            coverImage: rest.coverImage ?? "",
            readTime: rest.readTime ?? 0,
            pdfData: rest.pdfData ?? "",
            pdfName: rest.pdfName ?? "",
            createdAt: rest.createdAt ? new Date(rest.createdAt).toISOString() : undefined,
            updatedAt: rest.updatedAt ? new Date(rest.updatedAt).toISOString() : undefined,
            markdownEn: rest.markdownEn ?? "",
            markdownZh: rest.markdownZh ?? "",
            ...(rest.uiSettings && { uiSettings: rest.uiSettings }),
          };
        })
      : DEFAULT_DATA.projects;

  const blogs =
    blogDocs && blogDocs.length > 0
      ? blogDocs.map((b: any) => {
          const { _id, ...rest } = b;
          return {
            id: rest.id,
            title: rest.title ?? "",
            titleZh: rest.titleZh ?? "",
            description: rest.description ?? "",
            descriptionZh: rest.descriptionZh ?? "",
            contentEn: rest.contentEn ?? "",
            contentZh: rest.contentZh ?? "",
            coverImage: rest.coverImage ?? "",
            colSpan: rest.colSpan ?? 1,
            rowSpan: rest.rowSpan ?? 1,
            order: rest.order ?? 0,
            readTime: rest.readTime ?? 0,
            pdfData: rest.pdfData ?? "",
            pdfName: rest.pdfName ?? "",
            createdAt: rest.createdAt ? new Date(rest.createdAt).toISOString() : undefined,
            updatedAt: rest.updatedAt ? new Date(rest.updatedAt).toISOString() : undefined,
          };
        })
      : DEFAULT_DATA.blogs;

  const iot = iotDoc
    ? {
        title: iotDoc.title ?? DEFAULT_DATA.iot.title,
        titleZh: iotDoc.titleZh ?? DEFAULT_DATA.iot.titleZh,
        description: iotDoc.description ?? DEFAULT_DATA.iot.description,
        descriptionZh: iotDoc.descriptionZh ?? DEFAULT_DATA.iot.descriptionZh,
        chartConfig: iotDoc.chartConfig ?? DEFAULT_DATA.iot.chartConfig ?? {},
      }
    : DEFAULT_DATA.iot;

  const dashboard = dashboardDoc?.widgets
    ? {
        widgets: (dashboardDoc.widgets as any[]).map((w) => ({
          id: w.id,
          type: w.type,
          order: w.order ?? 0,
          colSpan: w.colSpan ?? 1,
          rowSpan: w.rowSpan ?? 1,
          config: w.config ?? {},
        })),
      }
    : DEFAULT_DATA.dashboard;

  return { hero, resume, projects, blogs, iot, dashboard };
}

export async function saveCmsData(data: CmsData): Promise<void> {
  await Promise.all([
    upsertHero(toHeroPayload(data.hero)),
    upsertResume(toResumePayload(data.resume)),
    replaceProjects(toProjectsPayload(data.projects)),
    replaceBlogs(toBlogsPayload(data.blogs)),
    upsertIot(toIotPayload(data.iot)),
    upsertDashboard(toDashboardPayload(data.dashboard)),
  ]);
}
