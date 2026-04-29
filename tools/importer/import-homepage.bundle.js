var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/banner-announcement.js
  function parse(element, { document }) {
    const cells = [];
    const triageContainer = element.querySelector(".triage-cta-container");
    if (triageContainer) {
      const contentCell = [];
      const heading = triageContainer.querySelector("h2.title, h2, .title");
      const ctaLink = triageContainer.querySelector("a.triage-cta-link");
      if (heading && ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.href;
        link.textContent = heading.textContent.trim();
        contentCell.push(link);
      } else if (heading) {
        contentCell.push(heading);
      }
      if (contentCell.length > 0) {
        cells.push(contentCell);
      }
    } else {
      const textContainer = element.querySelector(".fade-in-slide-up") || element.querySelector(":scope > div") || element;
      const contentCell = [];
      const cloned = textContainer.cloneNode(true);
      if (cloned.textContent.trim()) {
        contentCell.push(cloned);
      }
      if (contentCell.length > 0) {
        cells.push(contentCell);
      }
    }
    if (cells.length === 0 && element.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = element.textContent.trim();
      cells.push([p]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "banner-announcement", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse2(element, { document }) {
    const bgImage = element.querySelector('.bkg-image img, img[src*="banner"]');
    const heading = element.querySelector("h1.title, h1, h2, .title");
    const description = element.querySelector('p.description, .body p, p[class*="description"]');
    const ctaLink = element.querySelector("a.c-interaction-button, a.button, .body a[href]");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (description) {
      contentCell.push(description);
    }
    if (ctaLink) {
      contentCell.push(ctaLink);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-text.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(":scope > li");
    const cells = [];
    cards.forEach((card) => {
      const contentCell = [];
      const heading = card.querySelector("h3.title, h2.title, h4.title, h3, h2");
      if (heading) {
        contentCell.push(heading);
      }
      const description = card.querySelector("p.description, p");
      if (description) {
        contentCell.push(description);
      }
      const cardLink = card.querySelector("a.card-link[href], a[href]");
      if (cardLink && cardLink.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = cardLink.getAttribute("href");
        link.textContent = heading ? heading.textContent.trim() : "Learn more";
        contentCell.push(link);
      }
      if (contentCell.length > 0) {
        cells.push(contentCell);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-text", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const cells = [];
    const cardDivs = element.querySelectorAll(".card");
    cardDivs.forEach((card) => {
      const img = card.querySelector(".card-image img, img.bg-image, img");
      const linkEl = card.querySelector("a.full-link, a[href]");
      const href = linkEl ? linkEl.getAttribute("href") : "";
      const titleEl = card.querySelector('h3.title, h3, [class*="title"]:not(div):not(span)');
      const descEl = card.querySelector("p.description, p");
      const imageCell = [];
      if (img) {
        imageCell.push(img);
      }
      const contentCell = [];
      if (titleEl) {
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = titleEl.textContent.trim();
          const heading = document.createElement("h3");
          heading.appendChild(link);
          contentCell.push(heading);
        } else {
          contentCell.push(titleEl);
        }
      }
      if (descEl && descEl.textContent.trim()) {
        contentCell.push(descEl);
      }
      if (href && !titleEl) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = href;
        contentCell.push(link);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse5(element, { document }) {
    const cardItems = element.querySelectorAll(":scope li");
    const cells = [];
    cardItems.forEach((li) => {
      const card = li.querySelector(".card") || li;
      const icon = card.querySelector('img.icon-image, img[class*="icon"]');
      const heading = card.querySelector("h3.title, h3, h2.title, h2");
      const description = card.querySelector("p.description, p");
      const cardLink = card.querySelector('a.card-link, a[class*="card-link"]');
      const iconCell = [];
      if (icon) {
        iconCell.push(icon);
      }
      const contentCell = [];
      if (heading) {
        contentCell.push(heading);
      }
      if (description) {
        contentCell.push(description);
      }
      if (cardLink && cardLink.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = cardLink.getAttribute("href");
        link.textContent = heading ? heading.textContent.trim() : "Learn more";
        const linkParagraph = document.createElement("p");
        linkParagraph.appendChild(link);
        contentCell.push(linkParagraph);
      }
      if (iconCell.length > 0 || contentCell.length > 0) {
        cells.push([iconCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/edc-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    var _a;
    if (hookName === TransformHook.beforeTransform) {
      const body = element.closest("body") || ((_a = element.ownerDocument) == null ? void 0 : _a.body);
      if (body && body.style.overflow === "hidden") {
        body.style.overflow = "auto";
      }
      WebImporter.DOMUtils.remove(element, ['link[href*="clientlibs"]']);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".header.aem-GridColumn"]);
      WebImporter.DOMUtils.remove(element, [".footer.aem-GridColumn"]);
      WebImporter.DOMUtils.remove(element, ["#skip-button"]);
      WebImporter.DOMUtils.remove(element, ["#skip-to-main-content"]);
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk", "#onetrust-banner-sdk", '[class*="onetrust"]', '[id*="onetrust"]', '[class*="ot-sdk"]']);
      WebImporter.DOMUtils.remove(element, ["iframe", "noscript", "link"]);
      element.querySelectorAll("[data-cmp-data-layer-name]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer-name");
      });
      element.querySelectorAll("[data-cmp-link-accessibility-enabled]").forEach((el) => {
        el.removeAttribute("data-cmp-link-accessibility-enabled");
      });
      element.querySelectorAll("[data-cmp-link-accessibility-text]").forEach((el) => {
        el.removeAttribute("data-cmp-link-accessibility-text");
      });
    }
  }

  // tools/importer/transformers/edc-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload || {};
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "banner-announcement": parse,
    "hero-banner": parse2,
    "cards-text": parse3,
    "cards-article": parse4,
    "cards-icon": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "EDC.ca homepage - main landing page for Export Development Canada",
    urls: [
      "https://www.edc.ca/"
    ],
    blocks: [
      {
        name: "banner-announcement",
        instances: [".section-blurb.full-width.bg-edc-dark-blue", ".c-triage-cta.full-width"]
      },
      {
        name: "hero-banner",
        instances: [".top-banner.full-width.top-banner-comp"]
      },
      {
        name: "cards-text",
        instances: [".knowledge-and-resources:first-of-type .cards-list"]
      },
      {
        name: "cards-article",
        instances: [".export-trends.full-width", ".trade-expertise-highlights.full-width .wrapper"]
      },
      {
        name: "cards-icon",
        instances: [".homepage-product-card.full-width .two-columns", ".knowledge-and-resources:last-of-type .cards-list"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Announcement Banner",
        selector: ".responsivegrid.homepage-flag .cmp-text",
        style: "dark-blue",
        blocks: ["banner-announcement"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Hero Banner",
        selector: ".top-banner.full-width.top-banner-comp",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Support Cards",
        selector: ".knowledge-and-resources:first-of-type",
        style: null,
        blocks: ["cards-text"],
        defaultContent: [".knowledge-and-resources:first-of-type .heading-wrapper"]
      },
      {
        id: "section-4",
        name: "Export Trends",
        selector: ".export-trends.full-width",
        style: "light-grey",
        blocks: ["cards-article"],
        defaultContent: [".export-trends h2"]
      },
      {
        id: "section-5",
        name: "Product Cards",
        selector: ".homepage-product-card.full-width",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Triage CTA",
        selector: ".c-triage-cta.full-width",
        style: "dark-blue",
        blocks: ["banner-announcement"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Resources Cards",
        selector: ".knowledge-and-resources:last-of-type",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: [".knowledge-and-resources:last-of-type .heading-wrapper"]
      },
      {
        id: "section-8",
        name: "Tailored Support",
        selector: ".trade-expertise-highlights.full-width",
        style: null,
        blocks: ["cards-article"],
        defaultContent: [".trade-expertise-highlights h2"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: ({ document, url, html, params }) => {
      const main = document.body;
      executeTransformers("beforeTransform", main, { document, url, html, params });
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, { document, url, html, params });
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
