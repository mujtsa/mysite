/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant.
 * Base block: cards
 * Source: https://www.edc.ca/
 * Generated: 2026-04-29
 *
 * Handles two source DOM patterns:
 * 1. .export-trends.full-width — tabbed card layout with .card elements containing
 *    .card-image > img and .card-body > .card-link-title > h3.title + a.full-link
 * 2. .trade-expertise-highlights .wrapper — ordered list of .card.default elements
 *    with img.bg-image, h3.title, p.description, and a[href]
 *
 * Target structure (from library-example.md):
 *   2 columns per row. Col 1: image. Col 2: heading + optional description + link.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which source pattern we are dealing with
  const cardDivs = element.querySelectorAll('.card');

  cardDivs.forEach((card) => {
    // --- Extract image ---
    // Pattern 1: .card-image > img
    // Pattern 2: img.bg-image
    const img = card.querySelector('.card-image img, img.bg-image, img');

    // --- Extract link href ---
    // Pattern 1: a.full-link[href]
    // Pattern 2: direct child a[href]
    const linkEl = card.querySelector('a.full-link, a[href]');
    const href = linkEl ? linkEl.getAttribute('href') : '';

    // --- Extract title ---
    // Both patterns use h3.title
    const titleEl = card.querySelector('h3.title, h3, [class*="title"]:not(div):not(span)');

    // --- Extract description ---
    // Pattern 2 has p.description; pattern 1 does not
    const descEl = card.querySelector('p.description, p');

    // Build image cell (Col 1)
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Build content cell (Col 2): heading + optional description + link
    const contentCell = [];

    if (titleEl) {
      // Create a linked heading if we have a link
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = titleEl.textContent.trim();
        const heading = document.createElement('h3');
        heading.appendChild(link);
        contentCell.push(heading);
      } else {
        contentCell.push(titleEl);
      }
    }

    if (descEl && descEl.textContent.trim()) {
      contentCell.push(descEl);
    }

    // If we have a link but no title used it, add standalone link
    if (href && !titleEl) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = href;
      contentCell.push(link);
    }

    // Only add the row if we have meaningful content
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
