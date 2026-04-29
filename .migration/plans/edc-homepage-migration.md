# EDC.ca Homepage Migration Plan

## Overview

Migrate the homepage of **https://www.edc.ca/** (Export Development Canada) to AEM Edge Delivery Services.

## Source

- **URL**: https://www.edc.ca/
- **Scope**: Single page (homepage)

## Current Project State

The project has the standard AEM boilerplate structure with these existing blocks:
- `hero` — Hero block with JS/CSS
- `columns` — Multi-column layout
- `cards` — Card grid layout
- `header` — Site header/navigation
- `footer` — Site footer
- `fragment` — Content fragment embedding

## Migration Approach

This migration will use the **excat-site-migration** skill to orchestrate:
1. **Page Analysis** — Scrape and analyze the homepage structure, identify sections, blocks, and content patterns
2. **Block Mapping** — Map source page elements to AEM blocks (reusing existing blocks where possible, creating new ones as needed)
3. **Import Infrastructure** — Generate parsers and transformers for content import
4. **Content Import** — Execute the import to produce the HTML content file
5. **Design Migration** — Extract and adapt the site's design system (colors, typography, spacing) to EDS
6. **Validation** — Preview the migrated page and compare against the original

## Checklist

- [ ] Analyze the EDC.ca homepage structure (sections, blocks, content patterns)
- [ ] Identify and catalog all block types present on the page
- [ ] Map source elements to existing or new AEM blocks
- [ ] Generate block parsers for each identified block variant
- [ ] Generate page transformers (cleanup + sections)
- [ ] Execute content import to produce homepage HTML
- [ ] Migrate site design system (colors, fonts, spacing, global styles)
- [ ] Migrate block-level styles for each identified block
- [ ] Preview the migrated page locally and validate rendering
- [ ] Compare migrated page against original and fix any visual discrepancies
- [ ] Run linting and performance checks

## Status: Ready for Execution

This plan is approved and ready to execute. Please switch to **Execute mode** (exit Plan mode) to begin the migration. The work will be orchestrated using the site migration workflow starting with page analysis of https://www.edc.ca/.
