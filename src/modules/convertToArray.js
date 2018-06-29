/**
 * Converts a list of nodes retrieved from the DOM into a JavaScript array. This allows the calling
 * of methods like 'map' and 'forEach' (which are not).
 *
 * @param {NodeList} list - The HTML list of nodes that should be transformed into an array.
 *
 * @example
 * // return [<div class="test">1</div>, <div class="test">2</div>, <div class="test">3</div>]
 * // HTML: <div class="test">1</div><div class="test">2</div><div class="test">3</div>
 * convertToArray(document.getElementsByClassName('test'));
 *
 * @returns {HTMLElement[]} - Returns the passed list of nodes as an array.
 */
export default function convertToArray(list) {
  return Array.prototype.slice.call(list);
}
