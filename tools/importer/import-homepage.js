/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import bannerAnnouncementParser from './parsers/banner-announcement.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsTextParser from './parsers/cards-text.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsIconParser from './parsers/cards-icon.js';

// TRANSFORMER IMPORTS
import edcCleanupTransformer from './transformers/edc-cleanup.js';
import edcSectionsTransformer from './transformers/edc-sections.js';

// PARSER REGISTRY
const parsers = {
  'banner-announcement': bannerAnnouncementParser,
  'hero-banner': heroBannerParser,
  'cards-text': cardsTextParser,
  'cards-article': cardsArticleParser,
  'cards-icon': cardsIconParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'EDC.ca homepage - main landing page for Export Development Canada',
  urls: [
    'https://www.edc.ca/'
  ],
  blocks: [
    {
      name: 'banner-announcement',
      instances: ['.section-blurb.full-width.bg-edc-dark-blue', '.c-triage-cta.full-width']
    },
    {
      name: 'hero-banner',
      instances: ['.top-banner.full-width.top-banner-comp']
    },
    {
      name: 'cards-text',
      instances: ['.knowledge-and-resources:first-of-type .cards-list']
    },
    {
      name: 'cards-article',
      instances: ['.export-trends.full-width', '.trade-expertise-highlights.full-width .wrapper']
    },
    {
      name: 'cards-icon',
      instances: ['.homepage-product-card.full-width .two-columns', '.knowledge-and-resources:last-of-type .cards-list']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Announcement Banner',
      selector: '.responsivegrid.homepage-flag .cmp-text',
      style: 'dark-blue',
      blocks: ['banner-announcement'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Hero Banner',
      selector: '.top-banner.full-width.top-banner-comp',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Support Cards',
      selector: '.knowledge-and-resources:first-of-type',
      style: null,
      blocks: ['cards-text'],
      defaultContent: ['.knowledge-and-resources:first-of-type .heading-wrapper']
    },
    {
      id: 'section-4',
      name: 'Export Trends',
      selector: '.export-trends.full-width',
      style: 'light-grey',
      blocks: ['cards-article'],
      defaultContent: ['.export-trends h2']
    },
    {
      id: 'section-5',
      name: 'Product Cards',
      selector: '.homepage-product-card.full-width',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Triage CTA',
      selector: '.c-triage-cta.full-width',
      style: 'dark-blue',
      blocks: ['banner-announcement'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Resources Cards',
      selector: '.knowledge-and-resources:last-of-type',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: ['.knowledge-and-resources:last-of-type .heading-wrapper']
    },
    {
      id: 'section-8',
      name: 'Tailored Support',
      selector: '.trade-expertise-highlights.full-width',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['.trade-expertise-highlights h2']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  edcCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [edcSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: ({ document, url, html, params }) => {
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, { document, url, html, params });

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, { document, url, html, params });

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
