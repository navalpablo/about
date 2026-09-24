import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";

// Check the exported application, not merely whether a deployment returned 200.
// A branch-based Jekyll build can otherwise replace the CV with the README.
const [siteUrl, expectedBuild = process.env.GITHUB_SHA ?? "local"] = process.argv.slice(2);
const cv = JSON.parse(await readFile("data/cv.public.json", "utf8"));
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
})[character]);

function verifyHtml(html) {
  assert.ok(html.includes(`data-cv-build="${expectedBuild}"`), "Expected CV build is not being served");
  assert.ok(html.includes('class="hero-summary"'), "CV application is missing");
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(id), `Broken section link: #${id}`);
  }
  // Protect career coverage from accidental current-only or education filters.
  for (const appointment of cv.appointments) {
    assert.ok(html.includes(escapeHtml(appointment.organization)), `Clinical experience missing: ${appointment.organization}`);
  }
  for (const education of cv.education) {
    assert.ok(html.includes(escapeHtml(education.institution)), `Training missing: ${education.institution}`);
  }
  for (const role of cv.leadership) {
    assert.ok(html.includes(escapeHtml(role.title)), `Professional role missing: ${role.title}`);
    if (role.description) assert.ok(html.includes(escapeHtml(role.description)), `Role delivery missing: ${role.title}`);
  }
  assert.ok(html.indexOf('id="background"') < html.indexOf('id="publications"'), "Training must precede publications");
  for (const project of cv.projects) {
    assert.ok(html.includes(escapeHtml(project.title)), `Project missing: ${project.title}`);
    if (project.funding_eur) {
      const funding = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(project.funding_eur);
      assert.ok(html.includes(funding), `Project funding missing: ${project.title}`);
    }
  }
  const stylesheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]
    .map(([tag]) => tag.match(/href="([^"]+)"/)?.[1]).filter(Boolean);
  assert.ok(stylesheets.length, "Compiled CSS is missing");
  return stylesheets;
}

if (!siteUrl) {
  const mirror = JSON.parse(await readFile("public/data/cv.public.json", "utf8"));
  assert.deepEqual(mirror, cv, "Public CV data is out of sync");
  const stylesheets = verifyHtml(await readFile("out/index.html", "utf8"));
  for (const href of stylesheets) {
    assert.ok(href.startsWith("/about/_next/"), `Wrong Pages asset path: ${href}`);
    await access(`out${href.slice("/about".length)}`);
  }
  await access("out/.nojekyll");
  await access("out/cv/Pablo_Naval_Baudin_CV_English_July_2026.pdf");
  console.log("Static CV, navigation, CSS, public data and downloadable PDF verified.");
} else {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const url = new URL(siteUrl);
      url.searchParams.set("build", expectedBuild);
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      assert.ok(response.ok, `Site returned HTTP ${response.status}`);
      const stylesheets = verifyHtml(await response.text());
      const css = await fetch(new URL(stylesheets[0], url), { signal: AbortSignal.timeout(15000) });
      assert.ok(css.ok && (css.headers.get("content-type") ?? "").includes("text/css"), "Published CSS is unavailable");
      console.log(`Live CV and stylesheet verified for ${expectedBuild}.`);
      process.exit(0);
    } catch (error) {
      lastError = error;
      if (attempt < 11) await setTimeout(10000);
    }
  }
  throw new Error(`Live CV verification failed. Ensure Settings → Pages → Source is GitHub Actions. ${lastError.message}`);
}
