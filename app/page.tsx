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

export default function Home() {
  const currentAppointments = cv.appointments.filter((item) => item.current);
  const highlightedLeadership = cv.leadership
    .filter(
      (item) =>
        item.current || item.id === "role_seram_2026_congress_leadership",
    )
    .slice(0, 5);
  const highlightedProjects: Project[] = cv.projects;
  const mspredict = highlightedProjects.find((project) => project.id === "project_mspredict");
  const selectedPublications = cv.publications.filter((item) => item.selected);
  const selectedTalks = cv.talks;
  const recentAwards = cv.awards.slice(0, 6);
  const featuredMedia = cv.media.slice(0, 9);
  const selectedEducation = cv.education.filter((item) =>
    [
      "edu_phd_ub",
      "edu_radiology_residency_bellvitge",
      "edu_medical_degree_uab",
    ].includes(item.id),
  );

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Pablo Naval Baudín, home">
          PNB
        </a>
        <nav aria-label="Primary navigation">
          <a href="#research">Research</a>
          <a href="#publications">Publications</a>
          <a href="#profile">Profile</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Neuroradiology · Barcelona</p>
            <h1 id="hero-title">
              Pablo Naval Baudín<span className="credentials">, MD</span>
            </h1>
            <p className="hero-headline">{cv.profile.headline}</p>
            <p className="hero-summary">{cv.profile.summary}</p>
            <div className="hero-actions">
              <a className="primary-link" href={`mailto:${cv.contacts.email}`}>
                Get in touch <span aria-hidden="true">↗</span>
              </a>
              <a
                className="text-link"
                href={`${siteBasePath}/cv/Pablo_Naval_Baudin_CV_English_July_2026.pdf`}
                {...externalLink}
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>
              <a
                className="text-link"
                href={cv.contacts.google_scholar}
                {...externalLink}
              >
                Google Scholar <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <aside className="hero-aside" aria-label="Research profile summary">
            <p className="aside-label">At a glance</p>
            <dl className="metrics">
              <div>
                <dt>{cv.scientific_profile.medline_indexed_publications}</dt>
                <dd>peer-reviewed publications</dd>
              </div>
              <div>
                <dt>{cv.scientific_profile.h_index.google_scholar}</dt>
                <dd>Google Scholar h-index</dd>
              </div>
              {mspredict?.funding_eur ? (
                <div>
                  <dt>{formatFunding(mspredict.funding_eur)}</dt>
                  <dd>MSPredict project funding · PI</dd>
                </div>
              ) : null}
            </dl>
            <p className="metric-note">
              Google Scholar h-index updated {cv.scientific_profile.google_scholar_as_of ?? cv.scientific_profile.metrics_as_of}; publication count {cv.scientific_profile.publications_as_of ?? cv.scientific_profile.metrics_as_of}
            </p>
          </aside>
        </section>

        <section className="section shell" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="section-number">01</p>
            <div>
              <p className="eyebrow">Current appointments</p>
              <h2 id="work-title">Clinical practice, research and leadership</h2>
            </div>
          </div>

          <div className="work-grid">
            <div className="ruled-list">
              {currentAppointments.map((appointment) => (
                <article className="work-item" key={appointment.id}>
                  <p className="item-meta">
                    {formatRange(appointment.start_date, appointment.end_date)}
                  </p>
                  <div>
                    <h3>{appointment.title}</h3>
                    <p className="organization">{appointment.organization}</p>
                    {appointment.details?.[0] ? (
                      <p className="item-detail">{appointment.details[0]}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <aside className="leadership-panel">
              <p className="aside-label">Institutional roles</p>
              <ul>
                {highlightedLeadership.map((role) => (
                  <li key={role.id}>
                    <strong>{role.title}</strong>
                    <span>{role.organization}</span>
                    {role.subroles ? (
                      <span>{role.subroles.join(" · ")}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </aside>
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
              <p className="eyebrow">Research</p>
              <h2 id="research-title">Selected projects</h2>
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
                        {project.title} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                </div>
                <div>
                  <p className="project-role">
                    {[project.role, project.type, project.institution]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {project.principal_investigator ? (
                    <p className="item-detail">Principal Investigator: {project.principal_investigator}</p>
                  ) : null}
                  <p>{project.description}</p>
                  {project.funding_eur ? (
                    <p className="item-detail">
                      {formatFunding(project.funding_eur)} project funding · {project.call} · {project.funder}
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
          className="section shell"
          id="publications"
          aria-labelledby="publications-title"
        >
          <div className="section-heading">
            <p className="section-number">03</p>
            <div>
              <p className="eyebrow">Publications</p>
              <h2 id="publications-title">Selected peer-reviewed articles</h2>
            </div>
          </div>

          <div className="publication-list">
            {selectedPublications.map((publication, index) => (
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
                      {publication.citation} <span aria-hidden="true">↗</span>
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
            ))}
          </div>

          <div className="section-actions">
            <a
              className="primary-link"
              href={cv.contacts.google_scholar}
              {...externalLink}
            >
              Full publication record <span aria-hidden="true">↗</span>
            </a>
            <span>
              {cv.scientific_profile.medline_indexed_publications} peer-reviewed
              publications ({cv.scientific_profile.publications_as_of ?? cv.scientific_profile.metrics_as_of}) · Google Scholar h-index {cv.scientific_profile.h_index.google_scholar} ({cv.scientific_profile.google_scholar_as_of ?? cv.scientific_profile.metrics_as_of})
            </span>
          </div>
        </section>

        <section
          className="section shell"
          id="profile"
          aria-labelledby="profile-title"
        >
          <div className="section-heading">
            <p className="section-number">04</p>
            <div>
              <p className="eyebrow">Scientific profile</p>
              <h2 id="profile-title">Speaking, teaching and recognition</h2>
            </div>
          </div>

          <div className="profile-grid">
            <div>
              <div className="subsection-heading">
                <p className="aside-label">Selected speaking</p>
                <p>Invited lectures, panels and workshops</p>
              </div>
              <div className="compact-list">
                {selectedTalks.map((talk) => (
                  <article key={talk.id}>
                    <p className="item-meta">
                      {formatDate(talk.date ?? talk.date_start)}
                    </p>
                    <div>
                      {talk.url ? (
                        <h3>
                          <a href={talk.url} {...externalLink}>
                            {talk.title} <span aria-hidden="true">↗</span>
                          </a>
                        </h3>
                      ) : (
                        <h3>{talk.title}</h3>
                      )}
                      <p>
                        {talk.role} · {talk.event}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <div className="subsection-heading">
                <p className="aside-label">Recognition</p>
                <p>Selected recent awards and distinctions</p>
              </div>
              <div className="compact-list">
                {recentAwards.map((award) => (
                  <article key={award.id}>
                    <p className="item-meta">{award.year}</p>
                    <div>
                      {award.url ? (
                        <h3>
                          <a href={award.url} {...externalLink}>
                            {award.award} <span aria-hidden="true">↗</span>
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
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="section shell media-section"
          id="media"
          aria-labelledby="media-title"
        >
          <div className="section-heading">
            <p className="section-number">05</p>
            <div>
              <p className="eyebrow">Media</p>
              <h2 id="media-title">Clinical AI and imaging in the public conversation</h2>
            </div>
          </div>

          <div className="media-grid">
            {featuredMedia.map((item) => (
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
                  {item.type} <span aria-hidden="true">↗</span>
                </p>
              </a>
            ))}
          </div>
        </section>

        <section
          className="section shell background-section"
          id="background"
          aria-labelledby="background-title"
        >
          <div className="section-heading">
            <p className="section-number">06</p>
            <div>
              <p className="eyebrow">Background</p>
              <h2 id="background-title">Training and professional profile</h2>
            </div>
          </div>

          <div className="background-grid">
            <div className="education-list">
              {selectedEducation.map((item) => (
                <article key={item.id}>
                  <p className="item-meta">
                    {formatRange(item.start_date, item.end_date)}
                  </p>
                  <div>
                    <h3>{item.qualification}</h3>
                    <p>{item.institution}</p>
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
                  ORCID {cv.contacts.orcid} <span aria-hidden="true">↗</span>
                </a>
                <a href={cv.contacts.google_scholar} {...externalLink}>
                  Google Scholar <span aria-hidden="true">↗</span>
                </a>
                <a href={cv.contacts.researchgate} {...externalLink}>
                  ResearchGate <span aria-hidden="true">↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="shell footer-grid">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Let&apos;s connect clinical questions with useful technology.</h2>
          </div>
          <div className="footer-links">
            <a href={`mailto:${cv.contacts.email}`}>{cv.contacts.email}</a>
            <a href={cv.contacts.linkedin} {...externalLink}>
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a href={cv.contacts.orcid_url} {...externalLink}>
              ORCID {cv.contacts.orcid} <span aria-hidden="true">↗</span>
            </a>
            <a href={cv.contacts.google_scholar} {...externalLink}>
              Google Scholar <span aria-hidden="true">↗</span>
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
