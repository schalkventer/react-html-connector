import PropTypes, { checkPropTypes } from 'prop-types';


const params = {
  input: PropTypes.string.isRequired,
};


/**
 * Takes a string with encoded HTML entities and returns the string with HTML entities decoded. For
 * example ' &amp;' will be decoded to '&'.
 *
 * @param {string} input - The string on which the HTML entities decoding function should be run.
 *
 * @example
 * // returns '<div data-value="30">£ 3000 & ¥ 2018</div>'
 * decodeHtmlEntities('&lt;div data-value=&quot;30&quot;&gt;£ 3000 &amp; &yen; 2018&lt;/div&gt;')
 *
 * @returns {string} - String with HTML entities decoded.
 */
export default function decodeHtmlEntities(input) {
  checkPropTypes(params, { input }, 'argument', 'decodeHtmlEntities');

  /* eslint-disable prefer-const */
  /* Not directly reassigned, but properties are reassign. Keep let to indicate this. */
  let element = document.createElement('div');
  /* eslint-enable */

  element.innerHTML = input;

  return element.childNodes.length === 0 ? '' : element.childNodes[0].nodeValue;
}
