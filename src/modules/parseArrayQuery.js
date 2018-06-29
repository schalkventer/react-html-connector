import PropTypes, { checkPropTypes } from 'prop-types';
import convertToArray from './convertToArray';


const params = {
  name: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  query: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
  callback: PropTypes.func.isRequired,
};


/**
 * Finds all HTML nodes in the {@link node} HTML tree that corresponds to the data attribute
 * specified in {@link name}. Returns an array that contains the of result of running
 * {@link callback} on each of node that corresponds to {@link name}. Value in {@link callback} is
 * ran on each HTML node seperately. Value in {@link name} is automatically passed to each instance
 * of {@link callback} as the first parameter. The second parameter is the specific node instance
 * that is processed. The last parameter is the first (and only) object nested inside the array
 * passed in {@link query}.
 *
 * @callback callback
 * @param {string} name - The name of the data attribute used to find HTML nodes to process. `data-`
 * is automatically prefixed to string.
 * @param {HTMLElement} node - The HTML node tree that should be searched for nodes with a specific
 * data attribue.
 * @param {Object[]} query - An array that has an object as its first and only value. This object
 * will be used when calling {@link callback} function.
 * @param {callback} callback - The function that should be executed for each HTML node that
 * corresponds to the string designated in {@link name}.
 *
 * @example
 * // return [1, 2, 3]
 * // HTML: <div id="node"><div data-items>1</div><div data-items>2</div><div data-items>3</div>
 * // </div>
 * const node = document.getElementById('node');
 * parseArrayQuery('items', node, [{ items: null }], node => node.innerHTML)
 *
 * @returns {*[]} - An array that contains all value returned by {@link callback} from each HTML
 * node.
 */
export default function parseArrayQuery(name, node, query, callback) {
  checkPropTypes(
    params,
    {
      name,
      node,
      query,
      callback,
    },
    'argument',
    'parseArrayQuery',
  );

  const nodesList = node.querySelectorAll(`[data-${name}]`);
  const nodesArray = convertToArray(nodesList);
  const innerQuery = query[0];

  return nodesArray.map(innerNode => callback(
    name,
    innerNode,
    innerQuery,
  ));
}
