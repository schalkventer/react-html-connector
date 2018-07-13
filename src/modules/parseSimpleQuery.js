import PropTypes, { checkPropTypes } from 'prop-types';
import decodeHtmlEntities from './decodeHtmlEntities';


const params = {
  name: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  query: (props, propName, componentName) => {
    const value = props[propName];

    const isInvalidQuery = (
      typeof value !== 'function' &&
      value !== 'boolean' &&
      value !== 'string' &&
      value !== 'number' &&
      value !== 'json' &&
      value !== 'innerHTML' &&
      value !== 'outerHTML' &&
      value !== 'innerText'
    );

    if (value && isInvalidQuery) {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}, expected to be a function, 'boolean', 'string', 'number', 'json', 'innerHTML', 'outerHTML', instead received: ${value}`);
    }

    return null;
  },
};


/**
 * Combines the string passed to {@link name} to form the name of a data attribute (for example
 * 'data-value' if 'value is passed). The HTML node passed to {@link node} is then searched for the
 * data attribute specified above. Once found, either the attribute's value or the node itself
 * passed is parsed according to the string passed to {@link query}.
 *
 * @param {string} name - Name of attribute to target (automatically prefixed attribute with
 * 'data-').
 * @param {Object} node - DOM node in which the attribute resides.
 * @param {string} [query] - Instruction on what to do with the attribute once found. See
 * checkParams function above for list of valid arguments.
 *
 * @example
 * // returns 13.49
 * // HTML node: <div id="test-1" data-value="13.49"></div>
 * parseSimpleQuery('value', document.getElementById('test-1'), 'number');
 *
 * @example
 * // returns 600
 * // HTML node: <div id="test-2" data-value="300"></div>
 * parseSimpleQuery('value', document.getElementById('test-2'), value => value * 3);
 *
 * @returns {*} - The value of the data attribute or node after being parsed according to
 * {@link query}.
 */
export default function parseSimpleQuery(name, node, query) {
  checkPropTypes(params, { name, node, query }, 'argument', 'parseSimpleQuery');

  if (!query) {
    return node;
  }

  const value = node.getAttribute(`data-${name}`);

  if (query === 'boolean') {
    return value !== null;
  }

  switch (query) {
    case 'string': return value;
    case 'number': return parseFloat(value);
    case 'json': return JSON.parse(decodeHtmlEntities(value));
    case 'innerHTML': return node.innerHTML;
    case 'outerHTML': return node.outerHTML;
    case 'innerText': return node.innerText;
    default: return null;
  }
}
