#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [sourceArg, outputArg = "data/cv.public.json"] = process.argv.slice(2);

if (!sourceArg) {
  throw new Error(
    "Usage: node scripts/generate-public-cv.mjs <master-cv.json> [output.json]",
  );
}

const sourcePath = resolve(sourceArg);
const outputPath = resolve(outputArg);
const master = JSON.parse(await readFile(sourcePath, "utf8"));

const compact = (value) =>
  Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== null && item !== undefined),
  );

const publicCv = {
  metadata: {
    schema_name: "pablo_naval_baudin_public_cv",
    schema_version: "1.0.3",
    last_updated: master.metadata.last_updated,
    generated_from: master.metadata.schema_name,
  },
  person: {
    full_name: master.person.full_name,
    professional_name: master.person.professional_name,
    credentials: master.person.credentials,
    location: master.person.location,
  },
  profile: {
    headline: master.profile.headline,
    summary: master.profile.summary,
    clinical_specialties: master.profile.clinical_specialties,
    research_specialties: master.profile.research_specialties,
  },
  contacts: {
    email: master.contacts.primary_email,
    linkedin: master.contacts.linkedin,
    x_twitter: master.contacts.x_twitter,
    google_scholar: master.contacts.google_scholar,
    orcid: master.contacts.orcid,
    orcid_url: master.contacts.orcid_url,
    web_of_science_researcher_id:
      master.contacts.web_of_science_researcher_id,
    scopus_author_id: master.contacts.scopus_author_id,
    researchgate: master.contacts.researchgate,
  },
  scientific_profile: {
    metrics_as_of: master.scientific_profile.metrics_as_of,
    publications_as_of: master.scientific_profile.publications_as_of,
    google_scholar_as_of: master.scientific_profile.google_scholar_as_of,
    medline_indexed_publications:
      master.scientific_profile.medline_indexed_publications,
    h_index: master.scientific_profile.h_index,
    peer_review: master.scientific_profile.peer_review,
  },
  appointments: master.appointments.map((item) =>
    compact({
      id: item.id,
      title: item.title,
      organization: item.organization,
      location: item.location,
      start_date: item.start_date,
      end_date: item.end_date,
      current: item.current,
      details: item.details,
    }),
  ),
  leadership: master.leadership_and_institutional_roles.map((item) =>
    compact({
      id: item.id,
      title: item.title,
      organization: item.organization,
      location: item.location,
      start_date: item.start_date,
      end_date: item.end_date,
      current: item.current,
      years: item.years,
      subroles: item.subroles,
      url: item.url,
    }),
  ),
  education: master.education.map((item) =>
    compact({
      id: item.id,
      qualification: item.qualification,
      institution: item.institution,
      location: item.location,
      start_date: item.start_date,
      end_date: item.end_date,
      current: item.current,
      focus: item.focus,
    }),
  ),
  research_lines: master.research_lines,
  projects: master.research_grants_and_projects
    .filter((item) => item.include_by_default !== false)
    .map((item) =>
      compact({
        id: item.id,
        title: item.title,
        role: item.role,
        type: item.type,
        institution: item.institution,
        funder: item.funder,
        funding_eur: item.funding_eur,
        principal_investigator: item.principal_investigator,
        highlight: item.highlight,
        call: item.call,
        reference: item.reference,
        start_date: item.start_date,
        end_date: item.end_date,
        current: item.current,
        date_label: item.date_label,
        description: item.description,
        outcomes: item.outcomes,
        url: item.url_visibility === "protected_internal" ? undefined : item.url,
      }),
    ),
  talks: master.talks_and_teaching
    .filter((item) => item.external && item.selected)
    .map((item) =>
      compact({
        id: item.id,
        title: item.title,
        role: item.role,
        event: item.event,
        organization: item.organization,
        location: item.location,
        date: item.date,
        date_start: item.date_start,
        date_end: item.date_end,
        notes: item.notes,
        url: item.url,
      }),
    ),
  awards: master.awards_and_recognition.map((item) =>
    compact({
      id: item.id,
      year: item.year,
      award: item.award,
      organization: item.organization,
      awarded_work: item.awarded_work,
      role: item.role,
      url: item.url,
    }),
  ),
  media: master.media.map((item) => ({
    id: item.id,
    date: item.date,
    outlet: item.outlet,
    title: item.title,
    type: item.type,
    url: item.url,
  })),
  publications: master.publications.map((item) =>
    compact({
      id: item.id,
      year: item.year,
      citation: item.citation,
      author_note: item.author_note,
      selected: item.selected,
      doi: item.doi,
      url: item.url,
    }),
  ),
  languages: master.languages.map((item) => ({
    language: item.language,
    level: item.level,
    evidence: item.evidence,
  })),
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(publicCv, null, 2)}\n`, "utf8");

console.log(
  `Generated ${outputPath} with ${publicCv.publications.length} publications and no private fields.`,
);
