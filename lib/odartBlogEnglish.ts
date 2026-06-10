export type OdartEnglishBlogPost = {
  title: string;
  excerpt: string;
  category: string;
  contentHtml: string;
};

export const ODART_BLOG_ENGLISH: Record<string, OdartEnglishBlogPost> = {
  realizacje: {
    title: "Selected Projects",
    excerpt:
      "A selection of recent ODART projects, including websites for wedding video production, a senior home and a business law firm.",
    category: "Websites",
    contentHtml: "",
  },
  "pozycjonowanie-seo": {
    title: "Basic SEO Guidelines",
    excerpt:
      "Practical rules for placing keywords, structuring content and preparing a website for better visibility in search engines.",
    category: "Websites",
    contentHtml: `
      <h2>General SEO rules for business websites</h2>
      <p>Good SEO starts with a clear page structure, useful content and keywords placed where users and search engines expect them.</p>
      <h3>Use keywords in the right places</h3>
      <p>Add your main phrase to the page title, H1 heading, first paragraph, selected subheadings, image alt text and meta description. Do it naturally, without repeating the same phrase too many times.</p>
      <h3>Write for people first</h3>
      <p>A page should answer real questions: what you offer, where you work, who it is for and how the client can contact you. Search engines reward content that is useful, readable and specific.</p>
      <h3>Keep the website technically clean</h3>
      <p>Fast loading, responsive layout, internal links, clean URLs and proper metadata make it easier for Google to understand and index your website.</p>
      <p>SEO is not a one-time trick. It is a combination of content, structure, speed and regular improvements based on how people search for your service.</p>
    `,
  },
  "strona-internetowa-koszalin": {
    title: "Website Design in Koszalin",
    excerpt:
      "A short guide for businesses in Koszalin that want to discuss, plan and launch a professional website.",
    category: "Websites",
    contentHtml: `
      <h2>Website design for companies in Koszalin</h2>
      <p>If you run a business in Koszalin or nearby, a professional website can help clients quickly understand your offer and contact you without friction.</p>
      <h3>What a good business website should include</h3>
      <p>The most important elements are a clear offer, strong contact paths, mobile-friendly design, fast loading and content prepared for local search.</p>
      <h3>WordPress or custom Next.js website?</h3>
      <p>WordPress works well when you need easy content editing. A custom Next.js website is a better fit when performance, integrations or a more advanced interface are important.</p>
      <p>Before development starts, it is worth defining the goal of the website: more calls, more inquiries, better credibility or online sales.</p>
    `,
  },
  "strona-internetowa-kolobrzeg": {
    title: "Website Design in Kolobrzeg",
    excerpt:
      "Information for local businesses in Kolobrzeg looking for a clear, reliable and business-focused website.",
    category: "Websites",
    contentHtml: `
      <h2>Websites for companies in Kolobrzeg</h2>
      <p>A local business website should quickly explain what you do, show trust signals and make contact simple on desktop and mobile.</p>
      <h3>Local visibility matters</h3>
      <p>For companies in Kolobrzeg, content should include the service area, offer details, contact data and phrases that clients actually type into Google.</p>
      <h3>Design focused on conversion</h3>
      <p>The website should guide the visitor toward one clear action: calling, sending a message, booking a service or requesting a quote.</p>
      <p>A simple, fast and well-written website often works better than a complicated design with unclear navigation.</p>
    `,
  },
  "administracja-stron-internetowych-wordpress": {
    title: "WordPress Website Administration",
    excerpt:
      "What ongoing WordPress care includes: updates, maintenance, security checks and keeping a business website stable.",
    category: "Websites",
    contentHtml: `
      <h2>WordPress administration and maintenance</h2>
      <p>WordPress is flexible and popular, but it needs regular care to stay secure, stable and fast.</p>
      <h3>What maintenance includes</h3>
      <p>Typical work covers core and plugin updates, backups, security checks, performance improvements, small content changes and monitoring after updates.</p>
      <h3>Why it matters</h3>
      <p>Outdated plugins and themes are one of the most common reasons for website problems. Regular administration reduces the risk of errors, downtime and infections.</p>
      <p>For business owners, the goal is simple: the website should work, load quickly and remain easy to update when the offer changes.</p>
    `,
  },
  "tworzenie-stron-internetowych-na-wordpressie": {
    title: "Building Websites with WordPress",
    excerpt:
      "Why WordPress is still a popular CMS for business websites and when it is a good choice for a new project.",
    category: "Websites",
    contentHtml: `
      <h2>WordPress websites for business</h2>
      <p>WordPress is still a strong choice for many business websites because it gives owners an easy way to edit content, publish posts and manage pages.</p>
      <h3>When WordPress is a good fit</h3>
      <p>It works well for company websites, service pages, blogs, landing pages and smaller online stores where content management is important.</p>
      <h3>What matters during implementation</h3>
      <p>A WordPress website should be built with a clean structure, responsible plugin usage, responsive design, backups and basic SEO from the start.</p>
      <p>The best result is not just a nice layout. It is a website that is easy to use, easy to update and prepared to support real business goals.</p>
    `,
  },
};

export function getEnglishBlogPost(slug: string) {
  return ODART_BLOG_ENGLISH[slug];
}
