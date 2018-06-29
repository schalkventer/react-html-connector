import PropTypes, { checkPropTypes } from 'prop-types';


const params = {
  node: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
};

/**
 * Loops through properties inside {@link query} and executes {@link callback} for each property.
 * Passes key of propety as first param to {@link callback}. If value is array {@link node} is
 * passed as the second param, otherwise the function searches for the correct node inside the
 * {@link node} HTML tree. Lastly, the value of the property is passed as the last param.
 *
 * @callback callback
 * @param {HTMLElement} node - An HTML node element.
 * @param {Object} query - An object containing instructions to be used each time {@link callback}
 * is called.
 * @param {callback} callback - The function that should be called on each property in
 * {@link query}. Automatically passed three params to function.
 *
 * @example
 * // side-effect 1:
 * // callback(
 * //   <div id="node" data-value="400" data-example="test">Hello world!</div>,
 * //   'value',
 * //   'number'
 * // );
 * // side-effect 2:
 * // callback(
 * //   <div id="node" data-value="400" data-example="test">Hello world!</div>,
 * //   'example',
 * //   'string'
 * // );
 * // HTML: <div id="node" data-value="400" data-example="test">Hello world!</div>
 * const callback = fn => fn;
 * parseObjectQuery(document.getElementById('node'), { value: number }, callback);
 *
 * @returns {null} - No return. Only side-effects.
 */
export default function parseObjectQuery(node, query, callback) {
  checkPropTypes(params, { node, query, callback }, 'argument', 'parseObjectQuery');
  

  const queryKeys = Object.keys(query);
  queryKeys.forEach((key) => {
    const isArray = Array.isArray(query[key]);
    const innerNode = node.querySelector(`[data-${key}]`) || node;
    const returnedNode = isArray ? node : innerNode;

    return callback(key, returnedNode, query[key]);
  });

  return null;
}
