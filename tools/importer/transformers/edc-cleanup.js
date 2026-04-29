/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EDC.ca cleanup
 * Removes non-authorable site chrome (header, footer, nav, search, etc.)
 * and cleans up elements that interfere with block parsing.
 * All selectors verified against migration-work/cleaned.html captured DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Fix overflow:hidden on body that may block parsing
    // Found: <body class="page basicpage overflow-hidden"> (line 1)
    const body = element.closest('body') || element.ownerDocument?.body;
    if (body && body.style.overflow === 'hidden') {
      body.style.overflow = 'auto';
    }

    // Remove clientlib CSS link elements that interfere with parsing
    // Found: <link href="/etc.clientlibs/edc/clientlibs/..."> (lines 12, 33, 109, 110, etc.)
    WebImporter.DOMUtils.remove(element, ['link[href*="clientlibs"]']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove global header chrome
    // Found: <div class="header aem-GridColumn aem-GridColumn--default--12"> (line 5)
    WebImporter.DOMUtils.remove(element, ['.header.aem-GridColumn']);

    // Remove global footer chrome
    // Found: <div class="footer aem-GridColumn aem-GridColumn--default--12"> (line 3035)
    WebImporter.DOMUtils.remove(element, ['.footer.aem-GridColumn']);

    // Remove skip navigation button
    // Found: <a href="#skip-to-main-content" id="skip-button"> (line 14)
    WebImporter.DOMUtils.remove(element, ['#skip-button']);

    // Remove skip-to-main-content anchor div (empty landmark)
    // Found: <div id="skip-to-main-content"> (line 2547)
    WebImporter.DOMUtils.remove(element, ['#skip-to-main-content']);

    // Remove cookie consent / OneTrust dialog
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk', '#onetrust-banner-sdk', '[class*="onetrust"]', '[id*="onetrust"]', '[class*="ot-sdk"]']);

    // Remove remaining non-authorable elements
    // Found: iframe elements in footer area (lines 3301-3310)
    // Found: noscript, link elements throughout
    WebImporter.DOMUtils.remove(element, ['iframe', 'noscript', 'link']);

    // Clean up data attributes from AEM authoring that are not needed in import
    // Found: data-cmp-data-layer-name, data-cmp-link-accessibility-enabled on body (line 1)
    element.querySelectorAll('[data-cmp-data-layer-name]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer-name');
    });
    element.querySelectorAll('[data-cmp-link-accessibility-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-link-accessibility-enabled');
    });
    element.querySelectorAll('[data-cmp-link-accessibility-text]').forEach((el) => {
      el.removeAttribute('data-cmp-link-accessibility-text');
    });
  }
}
