/* eslint-disable camelcase */
/* global DATA */

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
    Book: 'Books',
    'Magazine Article': 'Magazines',
    Standard: 'Standards',
  };

  // Selectors
  const {
    ELEMENTS,
    ICONS,
    AUTHORS,
    TITLE,
    JOURNAL,
    DESCRIPTION,
    ABSTRACT,
    ABSTRACT_URL,
  } = DATA;

  // Retrieves the list of results
  return Array.from(document.querySelectorAll(ELEMENTS)).map((item) => {
    let volume;
    let issue;

    // Retrieve elements
    const authors = item.querySelector(AUTHORS);
    const title = (item.querySelector(TITLE) || item.querySelector('h2 > span')).innerText;
    const journal = item.querySelector(JOURNAL);
    // 'description' is the field that contains publication_year, publisher, content_type and/or volume, and issue
    const description = item.querySelector(DESCRIPTION).innerText.split('|').map((el) => el.trim());
    const abstract = item.querySelector(ABSTRACT);
    const abstract_url = item.querySelector(ABSTRACT_URL);

    const publication_year = parseInt(description.shift().slice(6), 10);
    const publisher = description.pop().slice(11);
    const type = description.length === 1 ? description.shift() : description.pop();
    const content_type = contentType[type];
    if (description.length === 1) [volume, issue] = description.shift().split(',').map((el) => el.trim());

    /* ICONS related fields */
    let html_url;
    let pdf_url;
    let course_url;
    // First icon is Abstract (whithout the actual content)
    if (['Journals', 'Conferences', 'Magazines'].includes(content_type)) {
      html_url = item.querySelector(`${ICONS} > li:nth-child(2) a`);
      pdf_url = item.querySelector(`${ICONS} > li:nth-child(3) a`);
    }
    if (['Books', 'Standards'].includes(content_type)) {
      pdf_url = item.querySelector(`${ICONS} > li:nth-child(2) a`);
    }
    if (content_type === 'Courses') {
      course_url = item.querySelector(`${ICONS} > li:nth-child(2) a`);
    }

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
              author.id = parseInt(url.split('/').pop(), 10);
            }
            return author;
          })
          : [],
      },
    };

    // Optional fields of result object, except for article_number which is a must
    if (abstract) result.abstract = abstract.innerText;
    if (item.querySelector(TITLE)) {
      result.article_number = item.querySelector(TITLE).getAttribute('href').split('/').filter(Boolean)
        .pop();
    } else {
      if (course_url) result.article_number = course_url.getAttribute('href').split('/').pop();
      if (pdf_url) result.article_number = pdf_url.getAttribute('href').match(/\d+/).shift();
    }
    //
    if (abstract_url) result.abstract_url = ieeeUrl + abstract_url.getAttribute('href');
    if (html_url) result.html_url = ieeeUrl + html_url.getAttribute('href');
    if (volume) result.volume = volume.slice(8);
    if (issue) result.issue = issue.slice(7);
    if (journal) {
      result.publication_title = journal.innerText;
      result.publication_number = parseInt(journal.getAttribute('href').match(/\d+/).shift(), 10);
    }
    if (pdf_url) {
      result.pdf_url = ieeeUrl + pdf_url.getAttribute('href');
    }
    if (type === 'Book') {
      result.publication_title = title;
      result.publication_number = parseInt(result.article_number, 10);
    }
    if (type === 'Standard') delete result.publication_number;

    return result;
  });
}

module.exports = createJSON;
