// .eleventy.js

// Fix MaxListenersExceededWarning
require("events").defaultMaxListeners = 200;

// Filters & utils
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");
const sortByDisplayOrder = require("./src/utils/sort-by-display-order.js");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");
const slugify = require("slugify");

const pathPrefix = process.env.PATH_PREFIX || "";

module.exports = (config) => {
  // Markdown
  config.setLibrary("md", markdownIt({ html: true, breaks: true, linkify: true }));

  // Filters
  config.addFilter("dateFilter", dateFilter);
  config.addFilter("w3DateFilter", w3DateFilter);
  config.addFilter("log", (value) => console.log(value));
  config.addFilter("slug", (str) => {
    if (!str) return;
    return slugify(str, { lower: true, strict: true, remove: /["]/g });
  });
  config.addFilter("sortByText", (array) => {
    if (!Array.isArray(array)) return array;
    return array.sort((a, b) => a.text.localeCompare(b.text));
  });
  config.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  // Address formatting: street (+suite) on line 1, city/state/zip on line 2
  config.addFilter("formatAddress", (address) => {
    if (!address || typeof address !== "string") return address;
    const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return address;

    if (parts.length === 1) {
      return parts[0];
    }

    // Heuristic: last two segments form the locality line (e.g., City and "ST ZIP")
    const cityPart = parts[parts.length - 2] || "";
    const regionPart = parts[parts.length - 1] || "";

    // Keep state and ZIP together with a non-breaking space when matching US pattern
    const regionFormatted = regionPart.replace(
      /^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/,
      "$1&nbsp;$2"
    );

    const line2 = cityPart ? `${cityPart}, ${regionFormatted}` : regionFormatted;
    const line1 = parts.slice(0, -2).join(", ");

    // If only two parts total, line1 would be empty; handle gracefully
    if (!line1) {
      return `${parts[0]}<br>${line2}`;
    }

    return `${line1}<br>${line2}`;
  });

  // Shortcodes / globals
  config.addShortcode("year", () => `${new Date().getFullYear()}`);
  config.addGlobalData("rootURL", "https://www.l3networks.com");

  // Collections
  config.addCollection("blogs", (collection) => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/blogs/*.md"));
  });
  config.addCollection("featuredWork", (collection) => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/work/*.md")).filter((x) => x.data.featured);
  });
  config.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });
  config.addCollection("faqs", (collection) => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/glossary/*.md"));
  });

  // Passthroughs
  config.addPassthroughCopy("./src/images/");                         // -> /images
  config.addPassthroughCopy({ "src/images": "images" });              // (ok if duplicated, but harmless)
  config.addPassthroughCopy({ "src/videos": "videos" });              // -> /videos (IMPORTANT)
  config.addPassthroughCopy({ "src/js": "js" });                      // -> /js assets
  config.addPassthroughCopy({ "css/kit.css": "css/kit.css" });        // -> /css/kit.css
  config.addPassthroughCopy({ "css/swiper-bundle.min.css": "css/swiper-bundle.min.css" });
  config.addPassthroughCopy({ "./node_modules/alpinejs/dist/cdn.js": "./js/alpine.js" });

  // BrowserSync
  config.setBrowserSyncConfig({
    host: "192.168.86.90",
    port: 3000,
    open: true,
    notify: false,
    files: [
      "src/**/*",
      "docs/**/*",
      "!docs/images/**/*",
    ],
  });

  if (pathPrefix) {
    config.addTransform("prefixStaticPaths", (content, outputPath) => {
      if (!outputPath || !outputPath.endsWith(".html")) return content;

      const prefix = pathPrefix.endsWith("/") ? pathPrefix.slice(0, -1) : pathPrefix;

      return content
        .replace(/(href|src)="\/([^"]*)"/g, (match, attr, assetPath) => `${attr}="${prefix}/${assetPath}"`)
        .replace(/(href|src)='\/([^']*)'/g, (match, attr, assetPath) => `${attr}='${prefix}/${assetPath}'`)
        .replace(/url\(\s*(['"]?)\/(?!\/)([^'")]+)(['"]?\))/g, (match, quote, assetPath, closing) => `url(${quote}${prefix}/${assetPath}${closing}`);
    });
  }

  // Return dirs / template engines
  return {
    dir: { input: "src", output: "docs", includes: "_includes", data: "_data" },
    pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
