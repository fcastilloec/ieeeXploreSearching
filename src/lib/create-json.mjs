/* global DATA */

/**
 * Queries the document/page for IEEE results.
 *
 * @returns {object[]}  Each IEEE result is an Object, which are part of the returned Array
 */
function createJSON() {
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
  const { ELEMENTS, ICONS, AUTHORS, TITLE, NO_TITLE, PUBLICATION, DESCRIPTION, ABSTRACT, ABSTRACT_URL } = DATA;

  // Retrieves the list of results
  return [...document.querySelectorAll(ELEMENTS)].map((item) => {
    let volume;
    let issue;

    // 'description' is the field that contains publication_year, publisher, content_type and/or volume, and issue
    const description = item
      .querySelector(DESCRIPTION)
      .textContent.split('|')
      .map((element) => element.trim());
    const publication_year = Number.parseInt(description.shift().slice(6), 10);
    const publisher = description.pop().slice(11);
    const type = description.length === 1 ? description.shift() : description.pop();
    if (description.length === 1)
      [volume, issue] = description
        .shift()
        .split(',')
        .map((element) => element.trim());

    // Retrieve elements
    const title = (item.querySelector(TITLE) || item.querySelector(NO_TITLE)).textContent;
    const authors = item.querySelector(AUTHORS);
    const abstract = item.querySelector(ABSTRACT);
    const abstract_url = item.querySelector(ABSTRACT_URL);
    const publication = item.querySelector(PUBLICATION);

    // Books and Courses titles are their own publication_title
    const publication_title = publication ? publication.textContent : title;

    // Books publication number is in the title
    const publication_number =
      publication ?
        publication.getAttribute('href').match(/\d+/).shift()
      : item.querySelector(TITLE).getAttribute('href').split('/').findLast(Boolean); // For Books only

    // URLs
    let html_url;
    let pdf_url;
    for (const element of item.querySelectorAll(ICONS)) {
      const course = element.querySelector('a[title="Access Course"]');
      const pdf = element.querySelector('xpl-view-pdf');
      if (pdf) pdf_url = pdf.querySelector('a').href;
      if (course) html_url = course.href;
      if (element.textContent === 'HTML') html_url = element.querySelector('a').href;
    }
    if (!html_url && abstract_url) html_url = abstract_url.href; // Some results don't have clickable titles

    // article_number get it from title. If title is not a link, get it from PDF.
    const article_number =
      item.querySelector(TITLE) ?
        item.querySelector(TITLE).getAttribute('href').split('/').findLast(Boolean)
      : new URL(pdf_url).searchParams.get('arnumber');

    // The result object will all the must have fields
    const result = {
      article_number,
      title,
      publication_year,
      publisher,
      content_type: contentType[type],
      publication_title,
      authors: {
        authors:
          authors ?
            [...authors.querySelectorAll('[data-tealium_data]')].map((value, index) => {
              const author = {
                full_name: value.textContent,
                author_order: index + 1,
              };
              const url = value.href;
              if (url) {
                author.authorUrl = url;
                author.id = Number.parseInt(url.split('/').findLast(Boolean), 10);
              }
              return author;
            })
          : [],
      },
    };

    // Optional fields of result object, except for article_number which is a must
    if (abstract) result.abstract = abstract.textContent;
    if (abstract_url) result.abstract_url = abstract_url.href;
    if (!Number.isNaN(publication_number)) result.publication_number = Number.parseInt(publication_number, 10);
    if (html_url) result.html_url = html_url;
    if (pdf_url) result.pdf_url = pdf_url;
    if (volume) result.volume = volume.slice(8);
    if (issue) result.issue = issue.slice(7);

    return result;
  });
}

export default createJSON;
