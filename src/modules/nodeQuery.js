import PropTypes, { checkPropTypes } from 'prop-types';
import parseObjectQuery from './parseObjectQuery';
import isObjectLiteral from './isObjectLiteral';
import parseArrayQuery from './parseArrayQuery';
import parseSimpleQuery from './parseSimpleQuery';


const params = {
  node: PropTypes.object,
  query: PropTypes.object.isRequired,
};


const parseValue = (result, arrayParent, objectIndex = 0) => (key, innerNode, value) => {
  if (Array.isArray(value)) {
    parseArrayQuery(key, innerNode, value, parseValue(result, key, 0));
  } else if (isObjectLiteral(value)) {
    objectIndex += 1;
    parseObjectQuery(innerNode, value, parseValue(result, arrayParent, objectIndex));
  } else if (arrayParent) {
    result[arrayParent] = result[arrayParent] || [];

    if (objectIndex === 0) {
      result[arrayParent].push(parseSimpleQuery(key, innerNode, value));
    }

    result[arrayParent][objectIndex - 1] = result[arrayParent][objectIndex - 1] || {};
    result[arrayParent][objectIndex - 1][key] = parseSimpleQuery(key, innerNode, value);
  } else {
    result[key] = parseSimpleQuery(key, innerNode, value);
  }
};


const isFunction = value => value && {}.toString.call(value) === '[object Function]'


export default function nodeQuery(query, node = window.document.body) {
  checkPropTypes(params, { node, query }, 'argument', 'nodeQuery');

  if (isFunction(query)) {
    return query(node, nodeQuery);
  }

  if (!isObjectLiteral(query)) {
    console.warn('query should be an object literal');
  }

  let result = {};
  parseObjectQuery(node, query, parseValue(result));

  return result;
}
