import PropTypes, { checkPropTypes } from 'prop-types';


const params = {
  value: PropTypes.any,
};


/**
 * Check wheter a value is an object literal. Helper is needed because using `typefor` and
 * `instanceof` will return true for arrays as well.
 *
 * @param {*} value - Value that should be check whether is object literal.
 *
 * @example
 * // return false
 * isObject(1);
 *
 * @example
 * // return false
 * isObject([]);
 *
 * @example
 * // return true
 * isObject({});
 *
 * @returns {boolean} - Boolean based on whether argument passed is an object literal.
 */
export default function isObjectLiteral(value) {
  checkPropTypes(params, { value }, 'argument', 'isObjectLiteral');
  return Object.prototype.toString.call(value) === '[object Object]';
}
