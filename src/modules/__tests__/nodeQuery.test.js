import { JSDOM } from 'jsdom';
import nodeQuery from './../nodeQuery';

const attributes = [
  'data-boolean',
  'data-string="lorem ipsum"',
  'data-int="12"',
  'data-decimal="34.567"',
  'data-json=\'{ "entry": "Hello", "leave": "Goodbye" }\'',
  'data-array=\'["Hello", "Goodbye"]\'',
];

const domShallow = new JSDOM(`<!DOCTYPE html><div id="node" ${attributes.join(' ')}>Hello world!</div>`);
const nodeShallow = domShallow.window.document.getElementById('node');

const divChain = attributes.map(item => `<div ${item}>Hello World!</div>`).join('');
const domEmbedded = new JSDOM(`<!DOCTYPE html><div id="node">${divChain}</div>`);
const nodeEmbedded = domEmbedded.window.document.getElementById('node');

const arrayChain = [1, 2, 3].map(() => `<div data-items ${attributes.join(' ')}></div>`);
const domArray = new JSDOM(`<!DOCTYPE html><div id="node">${arrayChain}</div>`);
const nodeArray = domArray.window.document.getElementById('node');


const basicQuery = {
  boolean: 'boolean',
  booleanFalse: 'boolean',
  string: 'string',
  int: 'number',
  decimal: 'number',
  json: 'json',
  array: 'json',
};

const arrayQuery = {
  items: [
    basicQuery,
  ],
};

const shallowInput = nodeQuery(basicQuery, nodeShallow);
const embeddedInput = nodeQuery(basicQuery, nodeEmbedded);
const arrayInput = nodeQuery(arrayQuery, nodeArray);

const basicOutput = {
  boolean: true,
  booleanFalse: false,
  string: 'lorem ipsum',
  int: 12,
  decimal: 34.567,
  json: { entry: 'Hello', leave: 'Goodbye' },
  array: ['Hello', 'Goodbye'],
};

const arrayOutput = {
  items: [1, 2, 3].map(() => basicOutput),
};


test('Correctly returns props from shallow query', () => expect(shallowInput).toEqual(basicOutput));
test('Correctly returns props from embedded nodes', () => expect(embeddedInput).toEqual(basicOutput));
test('Correctly returns props from array of nodes', () => expect(arrayInput).toEqual(arrayOutput));
