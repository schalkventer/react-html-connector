import { JSDOM } from 'jsdom';
import parseObjectQuery from './../parseObjectQuery';


const attributes = [
  'data-boolean',
  'data-string="lorem ipsum"',
  'data-int="12"',
  'data-decimal="34.567"',
  'data-json=\'{ "entry": "Hello", "leave": "Goodbye" }\'',
  'data-array=\'["Hello", "Goodbye"]\'',
];


const dom = new JSDOM(`<!DOCTYPE html><div id="node" ${attributes.join(' ')}>Hello world!</div>`);
const node = dom.window.document.getElementById('node');


const query = {
  boolean: 'boolean',
  string: 'string',
  int: 'number',
  decimal: 'number',
  json: 'json',
  array: 'json',
};


const nodeQuery = jest.fn();
parseObjectQuery(node, query, nodeQuery)


const namesList = Object.keys(query);


test(
  'nodeQuery called correct number of times',
  () => expect(nodeQuery.mock.calls.length).toBe(namesList.length),
);


namesList.forEach((name, index) => {
  const result = [
    name,
    node,
    query[name],
  ];

  test(
    `Pass correct parameters for on data-${name}`,
    () => expect(nodeQuery.mock.calls[index]).toEqual(result),
  );
});
