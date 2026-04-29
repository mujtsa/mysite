/* eslint-disable */
/* global WebImporter */

/**
 * Parser for banner-announcement
 * Base block: banner-announcement (custom block)
 * Source: https://www.edc.ca/
 *
 * Handles two DOM patterns:
 *   1. .section-blurb.full-width.bg-edc-dark-blue — inline text with optional <a> link
 *   2. .c-triage-cta.full-width — triage CTA with h2 title and link wrapper
 *
 * Target table structure (1 column, 1 content row):
 *   Row 1: block name
 *   Row 2: text content with optional link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 2: .c-triage-cta with structured content (h2 title + link)
  const triageContainer = element.querySelector('.triage-cta-container');
  if (triageContainer) {
    const contentCell = [];
    const heading = triageContainer.querySelector('h2.title, h2, .title');
    const ctaLink = triageContainer.querySelector('a.triage-cta-link');

    if (heading && ctaLink) {
      // Wrap heading text in the link for the announcement output
      const link = document.createElement('a');
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
    // Pattern 1: .section-blurb / simple text container with optional inline link
    // Look for the text container (.fade-in-slide-up or direct child div/span)
    const textContainer = element.querySelector('.fade-in-slide-up')
      || element.querySelector(':scope > div')
      || element;

    const contentCell = [];

    // Clone the text container to preserve inline links and text nodes
    const cloned = textContainer.cloneNode(true);

    // If there is meaningful text content, use it
    if (cloned.textContent.trim()) {
      contentCell.push(cloned);
    }

    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
  }

  // Fallback: if no content was extracted, use the element's full text
  if (cells.length === 0 && element.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = element.textContent.trim();
    cells.push([p]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'banner-announcement', cells });
  element.replaceWith(block);
}
