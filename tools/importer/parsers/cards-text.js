/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-text variant.
 * Base block: cards (no images variant)
 * Source: https://www.edc.ca/
 * Selector: .knowledge-and-resources:first-of-type .cards-list
 *
 * Source structure: <ol class="cards-list"> with <li> items, each containing:
 *   - <a class="card-link" href="..."> (card-level link)
 *   - <div class="content-wrapper"> with <h3 class="title">, <p class="description">,
 *     and <div class="btn-wrapper"> (arrow icon, decorative)
 *
 * Target structure (1-column, no images):
 *   Row per card: heading + description + optional CTA link
 */
export default function parse(element, { document }) {
  // Select all card list items from the source
  const cards = element.querySelectorAll(':scope > li');

  const cells = [];

  cards.forEach((card) => {
    const contentCell = [];

    // Extract heading (h3.title, with fallbacks for h2, h4, or generic heading)
    const heading = card.querySelector('h3.title, h2.title, h4.title, h3, h2');
    if (heading) {
      contentCell.push(heading);
    }

    // Extract description (p.description, with fallback for any paragraph)
    const description = card.querySelector('p.description, p');
    if (description) {
      contentCell.push(description);
    }

    // Extract the card link — the <a class="card-link"> has the href but no text.
    // Create a proper link element using the heading text as the link label.
    const cardLink = card.querySelector('a.card-link[href], a[href]');
    if (cardLink && cardLink.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = cardLink.getAttribute('href');
      // Use heading text as link text, or fall back to a generic label
      link.textContent = heading ? heading.textContent.trim() : 'Learn more';
      contentCell.push(link);
    }

    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-text', cells });
  element.replaceWith(block);
}
