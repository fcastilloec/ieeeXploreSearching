/* eslint-disable camelcase */

/**
 * Queries the document/page for IEEE results.
 *
 * @returns {object[]}  Each IEEE result is an Object, which are part of the returned Array
 */
function createJSON() {
  const ieeeUrl = 'https://ieeexplore.ieee.org';

  // Translate between webpage and API types
  const contentType = {
    Course: 'Courses',
    'Conference Paper': 'Conferences',
    'Journal Article': 'Journals',
    'Book Chapter': 'Books',
    'Magazine Article': 'Magazines',
    Standard: 'Standards',
  };

  // LIST OF ELEMENTSS:
  const ELEMENTS = 'div.row.result-item.hide-mobile > div.col.result-item-align';
  const TITLE = 'h2 > a';
  const AUTHORS = 'p.author';
  const JOURNAL = 'div.description > a';
  const DESCRIPTION = 'div.description > div.publisher-info-container';
  const ABSTRACT = 'div.js-displayer-content.u-mt-1.stats-SearchResults_DocResult_ViewMore > span';
  const PDFURL = 'ul > li a.icon-pdf';
  const COURSEURL = 'ul > li .icon-access_course';
  const ABSTRACTURL = 'div.js-displayer-content.u-mt-1.stats-SearchResults_DocResult_ViewMore > a';
  const HTMLURL = 'ul > li a.icon-html';

  // Retrieves the list of results
  return Array.from(document.querySelectorAll(ELEMENTS)).map((item) => {
    let volume;
    let issue;

    // Retrieve elements
    const authors = item.querySelector(AUTHORS);
    const title = (item.querySelector(TITLE) || item.querySelector('h2 > span')).innerText;
    const abstract = item.querySelector(ABSTRACT);
    const journal = item.querySelector(JOURNAL);
    const pdf_url = item.querySelector(PDFURL);
    const abstract_url = item.querySelector(ABSTRACTURL);
    const course_url = item.querySelector(COURSEURL);
    const html_url = item.querySelector(HTMLURL);

    // 'description' is the field that contains publication_year, publisher, content_type and/or volume, and issue
    const description = item.querySelector(DESCRIPTION).innerText.split('|').map((el) => el.trim());
    const publication_year = description.shift().slice(6);
    const publisher = description.pop().slice(11);
    const content_type = contentType[description.length === 1 ? description.shift() : description.pop()];
    if (description.length === 1) [volume, issue] = description.shift().split(',').map((el) => el.trim());

    // The result object will all the must have fields
    const result = {
      title,
      publication_year,
      publisher,
      content_type,
      authors: {
        authors: authors
          ? Array.from(authors.querySelectorAll('a')).map((value, index) => {
            const author = { full_name: value.innerText, author_order: index + 1 };
            const url = value.getAttribute('href');
            if (url) {
              author.authorUrl = ieeeUrl + url;
              author.id = url.split('/').pop();
            }
            return author;
          })
          : [],
      },
    };

    // Optional fields of result object, except for article_number which is a must
    if (abstract) result.abstract = abstract.innerText;
    if (course_url) result.article_number = course_url.getAttribute('href').split('/').pop();
    if (abstract_url) result.abstract_url = ieeeUrl + abstract_url.getAttribute('href');
    if (html_url) result.html_url = ieeeUrl + html_url.getAttribute('href');
    if (volume) result.volume = volume.slice(8);
    if (issue) result.issue = issue.slice(7);
    if (journal) {
      result.publication_title = journal.innerText;
      result.publication_number = journal.getAttribute('href').match(/\d+/).shift();
    }
    if (pdf_url) {
      result.pdf_url = ieeeUrl + pdf_url.getAttribute('href');
      result.article_number = pdf_url.getAttribute('href').match(/\d+/).shift();
    }

    return result;
  });
}

module.exports = createJSON;
