import { JSDOM } from 'jsdom';
import parseArrayQuery from './../parseArrayQuery';
import convertToArray from './../convertToArray';


const attributes = [
  'data-items',
  'data-boolean',
  'data-string="lorem ipsum"',
  'data-int="12"',
  'data-decimal="34.567"',
  'data-json=\'{ "entry": "Hello", "leave": "Goodbye" }\'',
  'data-array=\'["Hello", "Goodbye"]\'',
];


const dom = new JSDOM(`<!DOCTYPE html><div id="node"><div ${attributes.join(' ')}>Hello world!</div><div ${attributes.join(' ')}>Hello world!</div><div ${attributes.join(' ')}>Hello world!</div></div>`);
const node = dom.window.document.getElementById('node');


const query = [
  {
    boolean: 'boolean',
    string: 'string',
    int: 'number',
    decimal: 'number',
    json: 'json',
    array: 'json',
  },
];


const nodeQuery = jest.fn();
parseArrayQuery('items', node, query, nodeQuery);


test(
  'nodeQuery called correct number of times', 
  () => expect(nodeQuery.mock.calls.length).toBe(3),
);


const items = dom.window.document.querySelectorAll('[data-items]')
const itemsArray = convertToArray(items);

itemsArray.forEach((innerNode, index) => {
  const result = [
    'items',
    innerNode,
    query[0],
  ];

  test('Pass correct parameters for on data-items', () => expect(nodeQuery.mock.calls[index]).toEqual(result));
});
