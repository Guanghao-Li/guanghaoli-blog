import type { CmsData } from "./data-store";
import { DEFAULT_DATA } from "./data-store";
import { getHeroDoc, upsertHero } from "@/models/Hero";
import { getResumeDoc, upsertResume } from "@/models/Resume";
import { getProjects, replaceProjects } from "@/models/Project";
import { getIotDoc, upsertIot } from "@/models/Iot";

function toHeroPayload(hero: CmsData["hero"]) {
  return {
    name: hero?.name ?? DEFAULT_DATA.hero.name,
    nameZh: hero?.nameZh ?? DEFAULT_DATA.hero.nameZh,
    subtitle: hero?.subtitle ?? DEFAULT_DATA.hero.subtitle,
    subtitleZh: hero?.subtitleZh ?? DEFAULT_DATA.hero.subtitleZh,
    ...(hero?.avatar !== undefined && { avatar: hero.avatar }),
  };
}

function toResumePayload(resume: CmsData["resume"]) {
  return {
    nameEn: resume?.nameEn ?? DEFAULT_DATA.resume.nameEn,
    nameZh: resume?.nameZh ?? DEFAULT_DATA.resume.nameZh,
    basicInfo: resume?.basicInfo ?? DEFAULT_DATA.resume.basicInfo,
    sections: resume?.sections ?? DEFAULT_DATA.resume.sections,
  };
}

function toProjectsPayload(projects: CmsData["projects"]) {
  return (projects ?? DEFAULT_DATA.projects).map((p) => ({
    id: p.id,
    title: p.title ?? "",
    titleZh: p.titleZh ?? "",
    description: p.description ?? "",
    descriptionZh: p.descriptionZh ?? "",
    tags: p.tags ?? [],
    size: p.size ?? "medium",
    markdownEn: p.markdownEn ?? p.markdown ?? "",
    markdownZh: p.markdownZh ?? p.markdown ?? "",
    ...(p.uiSettings && { uiSettings: p.uiSettings }),
  }));
}

function toIotPayload(iot: CmsData["iot"]) {
  return {
    title: iot?.title ?? DEFAULT_DATA.iot.title,
    titleZh: iot?.titleZh ?? DEFAULT_DATA.iot.titleZh,
    description: iot?.description ?? DEFAULT_DATA.iot.description,
    descriptionZh: iot?.descriptionZh ?? DEFAULT_DATA.iot.descriptionZh,
  };
}

export async function loadCmsData(): Promise<CmsData> {
  const [heroDoc, resumeDoc, projectDocs, iotDoc] = await Promise.all([
    getHeroDoc(),
    getResumeDoc(),
    getProjects(),
    getIotDoc(),
  ]);

  const hero = heroDoc
    ? {
        name: heroDoc.name ?? DEFAULT_DATA.hero.name,
        nameZh: heroDoc.nameZh ?? DEFAULT_DATA.hero.nameZh,
        subtitle: heroDoc.subtitle ?? DEFAULT_DATA.hero.subtitle,
        subtitleZh: heroDoc.subtitleZh ?? DEFAULT_DATA.hero.subtitleZh,
        ...(heroDoc.avatar && { avatar: heroDoc.avatar }),
      }
    : DEFAULT_DATA.hero;

  const resume = resumeDoc
    ? {
        nameEn: resumeDoc.nameEn ?? DEFAULT_DATA.resume.nameEn,
        nameZh: resumeDoc.nameZh ?? DEFAULT_DATA.resume.nameZh,
        basicInfo: resumeDoc.basicInfo ?? DEFAULT_DATA.resume.basicInfo,
        sections: resumeDoc.sections ?? DEFAULT_DATA.resume.sections,
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
            markdownEn: rest.markdownEn ?? "",
            markdownZh: rest.markdownZh ?? "",
            ...(rest.uiSettings && { uiSettings: rest.uiSettings }),
          };
        })
      : DEFAULT_DATA.projects;

  const iot = iotDoc
    ? {
        title: iotDoc.title ?? DEFAULT_DATA.iot.title,
        titleZh: iotDoc.titleZh ?? DEFAULT_DATA.iot.titleZh,
        description: iotDoc.description ?? DEFAULT_DATA.iot.description,
        descriptionZh: iotDoc.descriptionZh ?? DEFAULT_DATA.iot.descriptionZh,
      }
    : DEFAULT_DATA.iot;

  return { hero, resume, projects, iot };
}

export async function saveCmsData(data: CmsData): Promise<void> {
  await Promise.all([
    upsertHero(toHeroPayload(data.hero)),
    upsertResume(toResumePayload(data.resume)),
    replaceProjects(toProjectsPayload(data.projects)),
    upsertIot(toIotPayload(data.iot)),
  ]);
}
