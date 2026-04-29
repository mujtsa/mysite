/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://www.edc.ca/
 * Selector: .top-banner.full-width.top-banner-comp
 * Generated: 2026-04-29
 *
 * Source structure:
 *   .top-banner.full-width.top-banner-comp
 *     .bkg-image.light-overlay > picture > img (background image)
 *     .banner-content.container > .body.light-overlay
 *       h1.title (heading)
 *       p.description (description paragraph)
 *       a.c-interaction-button (CTA link)
 *
 * Target table (from block library):
 *   Row 1: block name (auto via createBlock)
 *   Row 2: background image (optional)
 *   Row 3: heading + description + CTA (content cell)
 */
export default function parse(element, { document }) {
  // Extract background image from .bkg-image container
  // Validated selectors: .bkg-image img, .bkg-image picture
  const bgImage = element.querySelector('.bkg-image img, img[src*="banner"]');

  // Extract heading - validated: h1.title in source
  // Fallbacks for variation: h1, h2, .title, [class*="title"] heading
  const heading = element.querySelector('h1.title, h1, h2, .title');

  // Extract description paragraph - validated: p.description in source
  // Fallbacks: p (within .body), [class*="description"]
  const description = element.querySelector('p.description, .body p, p[class*="description"]');

  // Extract CTA link - validated: a.c-interaction-button in source
  // Fallbacks: a.button, .body a[href]
  const ctaLink = element.querySelector('a.c-interaction-button, a.button, .body a[href]');

  const cells = [];

  // Row 2: Background image (optional per block library description)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: Content cell - heading + description + CTA
  // Block library description: "Title (optional) styled as a Heading, Subheading (optional),
  // Call-to-Action (optional) text with a link"
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
