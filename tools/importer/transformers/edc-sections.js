/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EDC.ca sections
 * Inserts section breaks (<hr>) and Section Metadata blocks based on
 * template sections from page-templates.json.
 * All selectors verified against migration-work/cleaned.html captured DOM.
 *
 * Template sections (8 total):
 *   1. Announcement Banner (style: dark-blue) - selector: .responsivegrid.homepage-flag .cmp-text
 *   2. Hero Banner - selector: .top-banner.full-width.top-banner-comp
 *   3. Support Cards - selector: .knowledge-and-resources:first-of-type
 *   4. Export Trends (style: light-grey) - selector: .export-trends.full-width
 *   5. Product Cards - selector: .homepage-product-card.full-width
 *   6. Triage CTA (style: dark-blue) - selector: .c-triage-cta.full-width
 *   7. Resources Cards - selector: .knowledge-and-resources:last-of-type
 *   8. Tailored Support - selector: .trade-expertise-highlights.full-width
 *
 * Expected: 7 <hr> breaks, 3 Section Metadata blocks (sections 1, 4, 6 have styles)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload || {};
    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);

      if (!sectionEl) {
        continue;
      }

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before the section element (except for the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
