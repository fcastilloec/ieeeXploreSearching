// List of all elements
const ELEMENTS = 'xpl-results-item > div.hide-mobile';

/**
 * Selectors relative to each ELEMENT
 */
// Holds the main information, used to make selectors shorter
const main = 'div.row.result-item > div.col.result-item-align';
// Holds the abstract and various urls. (All the icons)
const icons = 'div.row.doc-access-tools-container';

// Elements inside MAIN
const AUTHORS = `${main} > xpl-authors-name-list > p.author`;
const TITLE = `${main} > h3 > a`;
const NO_TITLE = 'h3 > span';
const PUBLICATION = `${main} > div.description > a`;
const DESCRIPTION = `${main} > div.description > div.publisher-info-container`;

// Elements inside ICONS
const ABSTRACT = `${icons} > div.js-displayer-content.u-mt-1.stats-SearchResults_DocResult_ViewMore > span`;
const ABSTRACT_URL = `${icons} > div.js-displayer-content.u-mt-1.stats-SearchResults_DocResult_ViewMore > a`;

window.DATA = {
  ELEMENTS,
  AUTHORS,
  TITLE,
  NO_TITLE,
  ICONS: `${icons} > ul > li`,
  PUBLICATION,
  DESCRIPTION,
  ABSTRACT,
  ABSTRACT_URL,
};
