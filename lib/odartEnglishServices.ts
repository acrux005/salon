import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;
const EN_SERVICES = `${SITE}/en/services`;

export type OdartEnglishService = {
  slug: string;
  label: string;
  title: string;
  description: string;
  intro: string;
  bestFor: string[];
  deliverables: string[];
  outcome: string;
  polishHref: string;
};

export const ODART_ENGLISH_SERVICES: OdartEnglishService[] = [
  {
    slug: "custom-web-applications",
    label: "Custom web applications",
    title: "Custom web applications",
    description:
      "React, Next.js and TypeScript applications designed around your business process, users and production needs.",
    intro:
      "I design and build browser-based software that goes beyond a standard website: client portals, internal tools, configurators, dashboards and focused SaaS products.",
    bestFor: ["Companies with a process that does not fit off-the-shelf tools", "Teams that need a fast and clear interface", "Products that require integrations, roles or custom workflows"],
    deliverables: ["UX structure and application architecture", "React / Next.js implementation", "API integration, authentication and deployment"],
    outcome: "A maintainable web product that supports the way your business actually works.",
    polishHref: `${SITE}/produkt/nowoczesne-aplikacje-webowe/`,
  },
  {
    slug: "business-panels-and-systems",
    label: "Business panels and systems",
    title: "Business panels and internal systems",
    description:
      "Operational panels, dashboards, roles, reports and workflows that replace scattered spreadsheets and manual work.",
    intro:
      "I create internal systems for teams that need order in daily operations: order handling, task planning, customer records, calendars, reports and permission-based access.",
    bestFor: ["Restaurants, services and local companies", "Teams working with recurring tasks or orders", "Owners who need better visibility over operations"],
    deliverables: ["Process mapping and data structure", "Admin panel with roles and key views", "Reports, statuses, notifications or exports"],
    outcome: "Less manual coordination and a clearer view of what is happening in the company.",
    polishHref: `${SITE}/produkt/panele-i-systemy-dla-firm/`,
  },
  {
    slug: "api-integrations-and-automation",
    label: "API integrations and automation",
    title: "API integrations and automation",
    description:
      "Connecting shops, CRMs, couriers, payments, accounting and other systems through APIs, webhooks and automation.",
    intro:
      "I help systems talk to each other so data does not need to be copied by hand. The goal is a reliable flow between tools that already work in your business.",
    bestFor: ["Companies using several disconnected tools", "Online stores and order-based businesses", "Teams that repeat the same data entry every day"],
    deliverables: ["API and webhook integration", "Data mapping and error handling", "Automation of selected business flows"],
    outcome: "Fewer mistakes, faster work and a more predictable data flow.",
    polishHref: `${SITE}/produkt/integracje-api-i-automatyzacja/`,
  },
  {
    slug: "business-websites",
    label: "Business websites",
    title: "Business websites",
    description:
      "Professional websites planned for clarity, trust, search visibility and enquiries from potential clients.",
    intro:
      "A business website should explain your offer, build credibility and make contact easy. I plan the structure, design, content and implementation around that goal.",
    bestFor: ["Local companies and service providers", "Businesses replacing an outdated website", "Brands that need a clearer online offer"],
    deliverables: ["Information architecture and responsive layout", "WordPress or Next.js implementation", "Contact flow, analytics and SEO basics"],
    outcome: "A website that is easier to understand, easier to find and easier to contact from.",
    polishHref: `${SITE}/strony-internetowe/`,
  },
  {
    slug: "website-from-pln-1500",
    label: "One-page website",
    title: "One-page website",
    description:
      "A short company site: offer, contact, works on a phone. Design, build and launch.",
    intro:
      "This offer is for businesses that need a clean and functional website without unnecessary complexity at the start.",
    bestFor: ["Small companies starting online", "Simple service websites", "Projects with a clear scope and limited number of pages"],
    deliverables: ["Basic website structure", "Responsive layout and content placement", "Launch support and essential configuration"],
    outcome: "A solid first website that can grow later when the business needs more.",
    polishHref: `${SITE}/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl`,
  },
  {
    slug: "wordpress-websites",
    label: "WordPress websites",
    title: "WordPress websites",
    description:
      "WordPress websites for companies that need convenient content editing and a proven CMS.",
    intro:
      "WordPress makes sense when content management is important. I use it where it helps the client update pages, posts and offer sections without developer support.",
    bestFor: ["Marketing websites and blogs", "Companies that update content regularly", "Projects where CMS editing is important"],
    deliverables: ["WordPress installation and configuration", "Theme setup or custom layout", "Content structure, plugins and basic security"],
    outcome: "A website that is easy to edit and practical to maintain.",
    polishHref: `${SITE}/tworzenie-stron-internetowych-na-wordpressie`,
  },
  {
    slug: "wordpress-administration",
    label: "WordPress administration",
    title: "WordPress administration",
    description:
      "Ongoing WordPress updates, fixes, content support, backups and technical care for existing websites.",
    intro:
      "I help keep WordPress websites stable, updated and under control, especially when the site is important for enquiries or sales.",
    bestFor: ["Existing WordPress websites", "Companies without internal technical support", "Sites that need regular updates or fixes"],
    deliverables: ["Core, theme and plugin updates", "Backups, small fixes and content changes", "Security checks and performance improvements"],
    outcome: "A safer and more stable WordPress site with fewer surprises.",
    polishHref: `${SITE}/administracja-stron-internetowych-wordpress`,
  },
  {
    slug: "website-migration",
    label: "Website migration",
    title: "Website migration",
    description:
      "Safe website migration to a new hosting, domain or environment without losing key data.",
    intro:
      "Migration is not just copying files. I check the website, database, DNS, SSL, mail-related settings and the final result after launch.",
    bestFor: ["Websites moving to a better hosting provider", "Domain changes", "WordPress sites that need a controlled transfer"],
    deliverables: ["Files and database transfer", "Domain, SSL and configuration checks", "Post-migration testing"],
    outcome: "A smoother move with less downtime and fewer broken details.",
    polishHref: `${SITE}/produkt/migracja-strony-internetowej-na-inny-serwer/`,
  },
  {
    slug: "website-recovery-after-infection",
    label: "Website recovery after infection",
    title: "Website recovery after infection",
    description:
      "Cleaning infected WordPress websites, restoring access and improving basic security after malware incidents.",
    intro:
      "When a website is infected, the priority is to restore control, remove malicious code and reduce the chance of the same issue coming back.",
    bestFor: ["WordPress sites with malware warnings", "Websites redirecting users unexpectedly", "Businesses that lost admin access or trust in the site"],
    deliverables: ["Initial diagnosis and backup", "Malware cleanup and file review", "Updates, hardening and final checks"],
    outcome: "A cleaned website with clearer next steps for safer operation.",
    polishHref: `${SITE}/produkt/przywracanie-strony-internetowej-wordpress/`,
  },
  {
    slug: "website-pricing-estimate",
    label: "Website pricing estimate",
    title: "Website pricing estimate",
    description:
      "A practical consultation to define scope, features, technology and budget before building a website.",
    intro:
      "If you are not sure what kind of website you need, I help translate ideas into a clear scope and realistic estimate.",
    bestFor: ["Businesses comparing website options", "Projects before redesign or rebuild", "Clients who need a clear scope before starting"],
    deliverables: ["Short requirements discussion", "Feature and content outline", "Recommended approach and price range"],
    outcome: "A clearer decision about what to build, in what order and why.",
    polishHref: `${SITE}/produkt/wycena-strony-internetowej/`,
  },
  {
    slug: "seo-optimization",
    label: "SEO optimization",
    title: "SEO optimization",
    description:
      "Technical and content improvements that help search engines understand your website and users find the right information.",
    intro:
      "SEO starts with a technically healthy website, clear structure and pages that answer real user needs. I focus on practical improvements first.",
    bestFor: ["Websites with weak visibility in Google", "Companies planning a redesign", "Sites with unclear structure or slow mobile performance"],
    deliverables: ["Technical SEO review", "Metadata, headings and internal linking improvements", "Content recommendations and implementation plan"],
    outcome: "A website with stronger foundations for organic traffic.",
    polishHref: `${SITE}/produkt/seo-optymalizacja-strony/`,
  },
  {
    slug: "seo-positioning",
    label: "SEO positioning",
    title: "SEO positioning",
    description:
      "Ongoing SEO work focused on content, structure, local visibility and measurable search growth.",
    intro:
      "Positioning is a long-term process. I combine technical improvements with content planning and local search signals where they matter.",
    bestFor: ["Local businesses competing in search results", "Websites that need regular SEO work", "Companies that want organic enquiries over time"],
    deliverables: ["Keyword and competitor review", "Content and landing page recommendations", "Regular technical and on-page improvements"],
    outcome: "More consistent work toward better search visibility.",
    polishHref: `${SITE}/pozycjonowanie-seo`,
  },
  {
    slug: "social-media-support",
    label: "Social media support",
    title: "Social media support",
    description:
      "Consistent graphics, posts and communication support for social channels connected with your website and offer.",
    intro:
      "Social media works better when it is connected with a clear offer, visual style and website content instead of random posts.",
    bestFor: ["Local brands that need regular visuals", "Companies launching a new offer", "Businesses that want more consistent communication"],
    deliverables: ["Post concepts and graphics", "Visual consistency with the website", "Basic content planning"],
    outcome: "A more coherent presence across website and social channels.",
    polishHref: `${SITE}/produkt/obsluga-mediow-spolecznosciowych/`,
  },
  {
    slug: "cctv-monitoring-kolobrzeg",
    label: "CCTV and monitoring in Kolobrzeg",
    title: "CCTV and monitoring in Kolobrzeg",
    description:
      "Planning, installation and configuration of video monitoring systems for homes, companies and tourist facilities.",
    intro:
      "I help choose and configure monitoring systems so they are useful in everyday operation, not only installed on the wall.",
    bestFor: ["Small companies and offices", "Guest houses and tourist properties", "Homes that need practical monitoring"],
    deliverables: ["Camera and recorder selection", "Installation and network configuration", "Remote access and basic user guidance"],
    outcome: "A monitoring setup matched to the place and the way it will be used.",
    polishHref: `${SITE}/monitoring-i-kamery-kolobrzeg`,
  },
  {
    slug: "it-support-for-companies",
    label: "IT support for companies",
    title: "IT support for companies",
    description:
      "Monthly IT support for small and medium companies: helpdesk, workstations, network, backup and security.",
    intro:
      "I provide practical IT care for companies that want a predictable support channel and fewer interruptions in daily work.",
    bestFor: ["Small and medium companies", "Teams without internal IT", "Businesses that need regular technical support"],
    deliverables: ["Helpdesk and workstation support", "Network, backup and security checks", "Clear scope and communication channel"],
    outcome: "More reliable everyday IT and faster support when something stops working.",
    polishHref: `${SITE}/opieka-it-dla-firm-kolobrzeg`,
  },
  {
    slug: "it-specialist-kolobrzeg",
    label: "IT specialist Kolobrzeg",
    title: "IT specialist in Kolobrzeg",
    description:
      "Local IT help in Kolobrzeg for companies: computers, network, printers, software and everyday technical issues.",
    intro:
      "For local companies, fast and practical help matters. I support everyday IT problems and help organize the technical base of the business.",
    bestFor: ["Companies in Kolobrzeg and nearby areas", "Offices, services and small teams", "Businesses that need on-site or remote help"],
    deliverables: ["Computer and software support", "Network and printer troubleshooting", "Basic security, backup and setup guidance"],
    outcome: "A practical IT partner close to your business.",
    polishHref: `${SITE}/informatyk-kolobrzeg`,
  },
  {
    slug: "it-specialist-koszalin",
    label: "IT specialist Koszalin",
    title: "IT specialist in Koszalin",
    description:
      "Remote and regional IT support for companies in Koszalin: workstations, network, software and technical care.",
    intro:
      "I support companies in Koszalin remotely and regionally, helping solve everyday IT problems and organize reliable setups.",
    bestFor: ["Companies in Koszalin and the region", "Small teams without internal IT", "Businesses that need recurring technical support"],
    deliverables: ["Remote IT support", "Workstation and software troubleshooting", "Backup, security and network recommendations"],
    outcome: "More predictable IT support without building an internal department.",
    polishHref: `${SITE}/informatyk-koszalin`,
  },
];

export function getEnglishServiceBySlug(slug: string) {
  return ODART_ENGLISH_SERVICES.find((service) => service.slug === slug);
}

export function getEnglishServiceHref(slug: string) {
  return `${EN_SERVICES}/${slug}`;
}

export const ODART_ENGLISH_SERVICES_INDEX = EN_SERVICES;
