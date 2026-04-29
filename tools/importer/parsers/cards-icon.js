/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-icon
 * Base block: cards
 * Description: Cards with icon images, titles, descriptions, and links.
 *   Each card row has 2 columns: col1 = icon image, col2 = title + description + link.
 *
 * Source selectors:
 *   Instance 1: .homepage-product-card.full-width .two-columns
 *   Instance 2: .knowledge-and-resources:last-of-type .cards-list
 *
 * Source structure (both instances):
 *   ol > li > div.card
 *     a.card-link[href]          — card-level link
 *     div.content-wrapper
 *       img.icon-image           — icon (may be nested in span or title-wrapper)
 *       h3.title                 — card heading
 *       p.description            — card description
 *
 * Target structure (from library-example.md):
 *   | Cards (icon) |                                    |
 *   | icon image   | title + description + link         |
 *   | icon image   | title + description + link         |
 *
 * Generated: 2026-04-29
 */
export default function parse(element, { document }) {
  // Find all card items — both instances use li elements containing div.card
  const cardItems = element.querySelectorAll(':scope li');
  const cells = [];

  cardItems.forEach((li) => {
    const card = li.querySelector('.card') || li;

    // Extract icon image — may be nested in span, title-wrapper, or directly in content-wrapper
    const icon = card.querySelector('img.icon-image, img[class*="icon"]');

    // Extract heading — h3.title is the consistent pattern across both instances
    const heading = card.querySelector('h3.title, h3, h2.title, h2');

    // Extract description paragraph
    const description = card.querySelector('p.description, p');

    // Extract card link — the a.card-link wraps the entire card
    const cardLink = card.querySelector('a.card-link, a[class*="card-link"]');

    // Build cell 1: icon image
    const iconCell = [];
    if (icon) {
      iconCell.push(icon);
    }

    // Build cell 2: title + description + link
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (description) {
      contentCell.push(description);
    }
    // Create a proper link element for the CTA if we have a card link with an href
    if (cardLink && cardLink.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = cardLink.getAttribute('href');
      // Use heading text as link text, or fallback to 'Learn more'
      link.textContent = heading ? heading.textContent.trim() : 'Learn more';
      const linkParagraph = document.createElement('p');
      linkParagraph.appendChild(link);
      contentCell.push(linkParagraph);
    }

    // Only add row if we have meaningful content
    if (iconCell.length > 0 || contentCell.length > 0) {
      cells.push([iconCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
