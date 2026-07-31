import type { Metadata } from "next";
import "./globals.css";

const githubPagesBuild = process.env.GITHUB_PAGES === "true";
const siteBasePath = githubPagesBuild ? "/about" : "";
const canonicalUrl = "https://navalpablo.github.io/about/";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: {
    default: "Pablo Naval Baudín, MD",
    template: "%s · Pablo Naval Baudín",
  },
  description:
    "Consultant neuroradiologist and clinical researcher in Barcelona, working across multiple-sclerosis imaging, neuro-oncology and clinical AI.",
  authors: [{ name: "Pablo Naval Baudín" }],
  creator: "Pablo Naval Baudín",
  openGraph: {
    type: "website",
    url: canonicalUrl,
    title: "Pablo Naval Baudín, MD",
    description:
      "Consultant neuroradiologist and clinical researcher working across multiple-sclerosis imaging, neuro-oncology and clinical AI.",
    siteName: "Pablo Naval Baudín",
  },
  icons: {
    icon: `${siteBasePath}/favicon.svg`,
    shortcut: `${siteBasePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
