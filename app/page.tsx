import type { ReactNode } from "react";
import cv from "../data/cv.public.json";

const siteBasePath = process.env.GITHUB_PAGES === "true" ? "/about" : "";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatYear = (value?: string | null) =>
  value ? value.slice(0, 4) : "Present";

const formatRange = (start?: string | null, end?: string | null) =>
  `${formatYear(start)}–${end ? formatYear(end) : "Present"}`;

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const [year, month] = value.split("-");
  return month ? `${monthNames[Number(month) - 1]} ${year}` : year;
};

const formatProjectRange = (project: {
  start_date?: string | null;
  end_date?: string | null;
  current?: boolean;
  date_label?: string | null;
}) => {
  if (project.date_label) return project.date_label;
  const start = project.start_date;
  const end = project.current ? "Present" : project.end_date;
  if (!start) return end ?? "";
  if (!end || end === start) return start;
  return `${start}–${end}`;
};

type Project = (typeof cv.projects)[number] & {
  funding_eur?: number;
  principal_investigator?: string;
  highlight?: string;
};

const formatFunding = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

const externalLink = {
  target: "_blank",
  rel: "noreferrer",
} as const;

type SupportingMaterial = {
  label: string;
  url: string;
  kind: string;
};

function OutboundMark() {
  return <svg className="outbound-mark" aria-hidden="true" focusable="false" viewBox="0 0 16 16">
    <path d="M4 12 12 4m-7 0h7v7" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>;
}

function SupportingEvidence({
  items,
  activity,
}: {
  items?: SupportingMaterial[];
  activity: string;
}) {
  if (!items?.length) return null;

  return (
    <div className="evidence-links">
      {items.map((item) => (
        <a
          key={item.url}
          href={item.url.startsWith("/") ? `${siteBasePath}${item.url}` : item.url}
          aria-label={`${item.label}: ${activity}`}
          {...externalLink}
        >
          {item.label} <OutboundMark />
        </a>
      ))}
    </div>
  );
}

const sections = [
  ["work", "Experience"], ["leadership", "Leadership"], ["research", "Projects"],
  ["background", "Training"], ["publications", "Publications"], ["teaching", "Teaching"],
  ["talks", "Talks"], ["courses", "Courses"], ["recognition", "Awards"],
  ["media", "Media"], ["contact", "Contact"],
];

const pdfUrl = `${siteBasePath}/cv/Pablo_Naval_Baudin_CV_English_November_2026.pdf`;

function SectionLinks() {
  return sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>);
}

function Archive({ count, label, children }: { count: number; label: string; children: ReactNode }) {
  if (!count) return null;
  return (
    <details className="record-archive">
      <summary>
        <span className="when-closed">Show {count} more {label}</span>
        <span className="when-open">Hide additional {label}</span>
        <span className="disclosure-icon" aria-hidden="true" />
      </summary>
      {children}
    </details>
  );
}

const renderTalk = (talk: (typeof cv.talks)[number]) => (
  <article className="record-card" key={talk.id}>
    <p className="item-meta">
      {formatDate(talk.date ?? talk.date_start)}
      {"status" in talk && talk.status === "upcoming" ? " · Upcoming" : null}
    </p>
    <div>
      {talk.url ? (
        <h4>
          <a href={talk.url} {...externalLink}>
            {talk.title} <OutboundMark />
          </a>
        </h4>
      ) : (
        <h4>{talk.title}</h4>
      )}
      <p>
        {talk.role} · {talk.event}
      </p>
      <p className="compact-detail">{talk.organization} · {talk.location}</p>
      <SupportingEvidence items={talk.evidence} activity={talk.title} />
    </div>
  </article>
);

const renderCourse = (course: (typeof cv.courses)[number]) => (
  <article className="record-card" key={course.id}>
    <p className="item-meta">{formatDate(course.date)}</p>
    <div>
      <h4>{course.title}</h4>
      <p>{course.organization}</p>
      <p className="compact-detail">{course.location}</p>
      {course.notes ? <p className="compact-detail">{course.notes}</p> : null}
      <SupportingEvidence items={course.evidence} activity={course.title} />
    </div>
  </article>
);

const renderAward = (award: (typeof cv.awards)[number]) => (
  <article className="record-card" key={award.id}>
    <p className="item-meta">{award.year}</p>
    <div>
      {award.url ? (
        <h3>
          <a href={award.url} {...externalLink}>
            {award.award} <OutboundMark />
          </a>
        </h3>
      ) : (
        <h3>{award.award}</h3>
      )}
      <p>{award.organization}</p>
      {award.awarded_work ? (
        <p className="compact-detail">{award.awarded_work}</p>
      ) : null}
    </div>
  </article>
);

const renderMedia = (item: (typeof cv.media)[number]) => (
  <a
    className="media-card"
    href={item.url}
    key={item.id}
    {...externalLink}
  >
    <div>
      <p className="item-meta">{formatDate(item.date)}</p>
      <p className="media-outlet">{item.outlet}</p>
    </div>
    <h3>{item.title}</h3>
    <p className="media-type">
      {item.type} <OutboundMark />
    </p>
  </a>
);

export default function Home() {
  const appointmentOrder = ["appt_idi_bellvitge_consultant", "appt_bellvitge_radiomics_lead"];
  const currentAppointments = cv.appointments
    .filter((item) => item.current)
    .sort((a, b) => {
      const rank = (id: string) => {
        const index = appointmentOrder.indexOf(id);
        return index < 0 ? appointmentOrder.length : index;
      };
      return rank(a.id) - rank(b.id);
    });
  const clinicalRole = currentAppointments.find((item) => item.id === "appt_idi_bellvitge_consultant");
  const bellvitgeLead = currentAppointments.find(
    (item) => item.id === "appt_bellvitge_radiomics_lead",
  );
  const seramRole = cv.leadership.find(
    (item) => item.id === "role_seram_ai_commission_coordinator",
  );
  const previousAppointments = cv.appointments.filter((item) => !item.current);
  const teachingRoles = cv.leadership.filter((item) => item.years);
  const highlightedLeadership = cv.leadership
    .filter(
      (item) =>
        item.current || item.id === "role_seram_2026_congress_leadership",
    )
    .sort((a, b) => Number(a.id === "role_senr_young_committee") - Number(b.id === "role_senr_young_committee"));
  const projectOrder = ["project_imaginem", "project_ia_ictus", "project_rimlong", "project_mspredict", "project_brain_tumor_perfunomics", "project_amn_dimethyl_fumarate"];
  const projectRanks = new Map(projectOrder.map((id, i) => [id, i]));
  const highlightedProjects: Project[] = [...cv.projects].sort((a, b) =>
    (projectRanks.get(a.id) ?? Infinity) - (projectRanks.get(b.id) ?? Infinity)
  );
  const selectedPublications = cv.publications.filter((item) => item.selected);
  const featuredPublications = selectedPublications.slice(0, 6);
  const morePublications = selectedPublications.slice(featuredPublications.length);
  const selectedTalks = cv.talks;
  const recentAwards = cv.awards.slice(0, 6);
  const media = [...cv.media].sort((a, b) => b.date.localeCompare(a.date));
  const selectedEducation = cv.education;

  const renderPublication = (publication: (typeof cv.publications)[number], index: number) => (
              <article className="publication-item" key={publication.id}>
                <p className="publication-number">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <p className="item-meta">{publication.year}</p>
                  {publication.url ? (
                    <a
                      className="publication-citation"
                      href={publication.url}
                      {...externalLink}
                    >
                      {publication.citation} <OutboundMark />
                    </a>
                  ) : (
                    <p className="publication-citation">
                      {publication.citation}
                    </p>
                  )}
                  {publication.author_note ? (
                    <p className="publication-note">
                      {publication.author_note}
                    </p>
                  ) : null}
                </div>
              </article>
  );

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to CV</a>
      <div id="top" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="PNB — Pablo Naval Baudín, home">
          PNB
        </a>
        <nav aria-label="CV sections" className="desktop-index"><SectionLinks /></nav>
        <a className="compact-index-link" href="#section-index">CV sections <span aria-hidden="true">↓</span></a>
      </header>

      <main id="main-content" tabIndex={-1} data-cv-build={process.env.GITHUB_SHA ?? "local"}>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Neuroradiology · Barcelona</p>
            <h1 id="hero-title">
              Pablo Naval Baudín<span className="credentials">, MD</span>
            </h1>
            <p className="hero-headline">{cv.profile.headline}</p>
            <p className="hero-summary">{cv.profile.summary}</p>
            <div className="hero-actions">
              <a className="primary-link" href={pdfUrl} {...externalLink}>
                Download CV (PDF) <span aria-hidden="true">↓</span>
              </a>
              <a className="text-link" href={`mailto:${cv.contacts.email}`}>
                Get in touch <OutboundMark />
              </a>
              <a
                className="text-link"
                href={cv.contacts.google_scholar}
                {...externalLink}
              >
                Google Scholar <OutboundMark />
              </a>
            </div>
          </div>

          <aside className="hero-aside" aria-label="Clinical and project roles">
            <p className="aside-label">Clinical work &amp; project leadership</p>
            <ul className="role-highlights">
              {clinicalRole ? (
                <li>
                  <a href="#work"><strong>{clinicalRole.title}</strong></a>
                  <span>IDI · Hospital Universitari de Bellvitge · Since {formatYear(clinicalRole.start_date)}</span>
                </li>
              ) : null}
              {bellvitgeLead ? (
                <li>
                  <a href="#work"><strong>{bellvitgeLead.title}</strong></a>
                  <span>Hospital Universitari de Bellvitge</span>
                </li>
              ) : null}
              {seramRole ? (
                <li>
                  <a href="#leadership"><strong>{seramRole.title}</strong></a>
                  <span>SERAM · Spanish Society of Medical Radiology</span>
                </li>
              ) : null}
            </ul>
          </aside>
        </section>

        <nav className="section-index shell" id="section-index" aria-labelledby="index-title">
          <h2 id="index-title">CV sections</h2>
          <div><SectionLinks /></div>
        </nav>

        <section className="section shell" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="section-number">01</p>
            <div>
              <p className="eyebrow">Experience &amp; leadership</p>
              <h2 id="work-title">Clinical practice and coordinating roles</h2>
            </div>
          </div>

          <h3 className="aside-label career-heading">Current clinical and research appointments</h3>
          <div className="appointments-grid">
            {currentAppointments.map((appointment) => (
              <article className="work-item" key={appointment.id}>
                <p className="item-meta">{formatRange(appointment.start_date, appointment.end_date)}</p>
                <div>
                  <h3>{appointment.title}</h3>
                  <p className="organization">{appointment.organization}</p>
                  {appointment.details?.[0] ? <p className="item-detail">{appointment.details[0]}</p> : null}
                </div>
              </article>
            ))}
          </div>
          <h3 className="aside-label career-heading">Previous clinical experience</h3>
          <div className="ruled-list">
            {previousAppointments.map((appointment) => (
              <article className="work-item" key={appointment.id}>
                <p className="item-meta">{formatRange(appointment.start_date, appointment.end_date)}</p>
                <div>
                  <h3>{appointment.title}</h3>
                  <p className="organization">{appointment.organization}</p>
                  {appointment.details?.[0] ? <p className="item-detail">{appointment.details[0]}</p> : null}
                </div>
              </article>
            ))}
          </div>
          <h3 id="leadership" className="aside-label career-heading">Professional leadership</h3>
          <div className="leadership-grid" aria-label="Professional leadership and mentoring">
            {highlightedLeadership.map((role) => (
              <article className="leadership-entry" key={role.id}>
                <p className="item-meta">{formatRange(role.start_date, role.current ? null : role.end_date)}</p>
                <h3>{role.title}</h3>
                <p className="organization">{role.organization}</p>
                {role.description ? <p className="item-detail">{role.description}</p> : null}
                {role.subroles ? <p className="item-detail">{role.subroles.join(" · ")}</p> : null}
                {role.evidence_url ? <a className="text-link" href={role.evidence_url} {...externalLink}>Programme and team delivery <OutboundMark /></a> : null}
              </article>
            ))}
          </div>

        </section>

        <section
          className="section shell research-section"
          id="research"
          aria-labelledby="research-title"
        >
          <div className="section-heading">
            <p className="section-number">02</p>
            <div>
              <p className="eyebrow">Projects</p>
              <h2 id="research-title">Clinical implementation and funded research</h2>
            </div>
          </div>

          <div className="project-list">
            {highlightedProjects.map((project) => (
              <article className="project-item" key={project.id}>
                <div>
                  <p className="item-meta">{formatProjectRange(project)}</p>
                  <h3>
                    {project.url ? (
                      <a href={project.url} {...externalLink}>
                        {project.title} <OutboundMark />
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                </div>
                <div>
                  <p className="project-role">My role: {project.role}</p>
                  {project.type || project.institution ? (
                    <p className="project-context">{[project.type, project.institution]
                      .filter(Boolean)
                      .join(" · ")}</p>
                  ) : null}
                  {project.principal_investigator ? (
                    <p className="project-context">Principal Investigator: {project.principal_investigator}</p>
                  ) : null}
                  <p>{project.description}</p>
                  {project.funding_eur || project.call || project.funder ? (
                    <p className="project-funding">
                      {project.funding_eur ? <strong>{formatFunding(project.funding_eur)} {project.role === "Principal Investigator" ? "grant awarded" : "total project funding"}</strong> : null}
                      <span>{[project.call, project.funder].filter(Boolean).join(" · ")}</span>
                    </p>
                  ) : null}
                  {project.highlight ? (
                    <p className="item-detail">{project.highlight}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section shell background-section secondary-section"
          id="background"
          aria-labelledby="background-title"
        >
          <div className="section-heading">
            <p className="section-number">03</p>
            <div>
              <p className="eyebrow">Training</p>
              <h2 id="background-title">Training and international experience</h2>
            </div>
          </div>

          <div className="background-grid">
            <div className="education-list">
              {selectedEducation.map((item) => (
                <article key={item.id}>
                  <p className="item-meta">
                    {item.start_date?.slice(0, 4) === item.end_date?.slice(0, 4) ? formatYear(item.start_date) : formatRange(item.start_date, item.end_date)}
                  </p>
                  <div>
                    <h3>{item.qualification}</h3>
                    <p>{item.institution}</p>
                    {item.location ? <p className="compact-detail">{item.location}</p> : null}
                    {item.focus ? <p className="compact-detail">{item.focus}</p> : null}
                  </div>
                </article>
              ))}
            </div>

            <aside className="profile-panel">
              <div>
                <p className="aside-label">Languages</p>
                <ul className="tag-list">
                  {cv.languages.map((item) => (
                    <li key={item.language}>
                      <strong>{item.language}</strong>
                      <span>{item.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="identifier-list">
                <p className="aside-label">Research profiles</p>
                <a href={cv.contacts.orcid_url} {...externalLink}>
                  ORCID {cv.contacts.orcid} <OutboundMark />
                </a>
                <a href={cv.contacts.google_scholar} {...externalLink}>
                  Google Scholar <OutboundMark />
                </a>
                <a href={cv.contacts.researchgate} {...externalLink}>
                  ResearchGate <OutboundMark />
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section
          className="section shell"
          id="publications"
          aria-labelledby="publications-title"
        >
          <div className="section-heading">
            <p className="section-number">04</p>
            <div>
              <p className="eyebrow">Publications</p>
              <h2 id="publications-title">Selected peer-reviewed articles</h2>
            </div>
          </div>

          <p className="publication-metrics">
            <strong>{cv.scientific_profile.medline_indexed_publications}</strong> MEDLINE-indexed publications ({formatDate(cv.scientific_profile.publications_as_of)})
            <span aria-hidden="true"> · </span>
            Google Scholar h-index <strong>{cv.scientific_profile.h_index.google_scholar}</strong> ({formatDate(cv.scientific_profile.google_scholar_as_of)})
          </p>
          <div className="publication-list">
            {featuredPublications.map(renderPublication)}
          </div>

          <Archive label="selected publications" count={morePublications.length}>
            <div className="publication-list">
              {morePublications.map((p, i) => renderPublication(p, i + featuredPublications.length))}
            </div>
          </Archive>

          <div className="section-actions">
            <a
              className="primary-link"
              href={cv.contacts.google_scholar}
              {...externalLink}
            >
              Full publication record <OutboundMark />
            </a>

          </div>
        </section>

        <section id="profile" className="section shell secondary-section" aria-labelledby="profile-title">
          <div className="section-heading" id="teaching">
            <p className="section-number">05</p>
            <div><p className="eyebrow">Education &amp; outreach</p><h2 id="profile-title">Teaching and invited talks</h2></div>
          </div>
          <div className="record-group">
            <h3 className="record-heading">Teaching appointments</h3>
            <div className="record-grid pair">
              {teachingRoles.map((role) => (
                <article className="record-card" key={role.id}>
                  <p className="item-meta">{role.years?.join(", ")}</p>
                  <h4>{role.title}</h4><p>{role.organization}</p>
                </article>
              ))}
            </div>
          </div>
          <div id="talks" className="record-group">
            <h3 className="record-heading">Invited talks and workshops</h3>
            <div className="record-grid">{selectedTalks.slice(0, 3).map(renderTalk)}</div>
            <Archive count={Math.max(0, selectedTalks.length - 3)} label="talks and workshops">
              <div className="record-grid">{selectedTalks.slice(3).map(renderTalk)}</div>
            </Archive>
          </div>
          <div id="courses" className="record-group">
            <h3 className="record-heading">Professional courses attended</h3>
            <div className="record-grid pair">{cv.courses.slice(0, 2).map(renderCourse)}</div>
            <Archive count={Math.max(0, cv.courses.length - 2)} label="courses">
              <div className="record-grid pair">{cv.courses.slice(2).map(renderCourse)}</div>
            </Archive>
          </div>
        </section>

        <section id="recognition" className="section shell secondary-section" aria-labelledby="awards-title">
          <div className="section-heading">
            <p className="section-number">06</p>
            <div><p className="eyebrow">Recognition</p><h2 id="awards-title">Awards and distinctions</h2></div>
          </div>
          <div className="record-grid">{recentAwards.map(renderAward)}</div>
          <Archive count={cv.awards.length - recentAwards.length} label="awards">
            <div className="record-grid">{cv.awards.slice(recentAwards.length).map(renderAward)}</div>
          </Archive>
        </section>

        <section id="media" className="section shell secondary-section" aria-labelledby="media-title">
          <div className="section-heading">
            <p className="section-number">07</p>
            <div><p className="eyebrow">Media</p><h2 id="media-title">Interviews and press coverage</h2></div>
          </div>
          <div className="media-grid">{media.slice(0, 3).map(renderMedia)}</div>
          <Archive count={Math.max(0, media.length - 3)} label="media appearances">
            <div className="media-grid">{media.slice(3).map(renderMedia)}</div>
          </Archive>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="shell footer-grid">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Let&apos;s connect clinical questions with useful technology.</h2>
          </div>
          <div className="footer-links">
            <a href={pdfUrl} {...externalLink}>Download CV (PDF) <span aria-hidden="true">↓</span></a>
            <a href={`mailto:${cv.contacts.email}`}>{cv.contacts.email}</a>
            <a href={cv.contacts.linkedin} {...externalLink}>
              LinkedIn <OutboundMark />
            </a>
            <a href={cv.contacts.orcid_url} {...externalLink}>
              ORCID {cv.contacts.orcid} <OutboundMark />
            </a>
            <a href={cv.contacts.google_scholar} {...externalLink}>
              Google Scholar <OutboundMark />
            </a>
            <a
              href={`${siteBasePath}/data/cv.public.json`}
              {...externalLink}
            >
              Public CV data (JSON) <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="shell footer-note">
          <span>© {new Date().getFullYear()} Pablo Naval Baudín</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
