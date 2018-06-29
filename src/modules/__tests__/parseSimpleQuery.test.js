import { JSDOM } from 'jsdom';
import parseSimpleQuery from './../parseSimpleQuery';


const attributes = [
  'data-boolean',
  'data-string="lorem ipsum"',
  'data-int="12"',
  'data-decimal="34.567"',
  'data-json=\'{ "entry": "Hello", "leave": "Goodbye" }\'',
  'data-array=\'["Hello", "Goodbye"]\'',
  'data-innerHtml',
  'data-outerHtml',
];


const dom = new JSDOM(`<!DOCTYPE html><div id="node" ${attributes.join(' ')}>Hello world!</div>`);
const node = dom.window.document.getElementById('node');


const booleanTrue = parseSimpleQuery('boolean', node, 'boolean');
const booleanFalse = parseSimpleQuery('boolean-false', node, 'boolean');
const string = parseSimpleQuery('string', node, 'string');
const int = parseSimpleQuery('int', node, 'number');
const decimal = parseSimpleQuery('decimal', node, 'number');
const json = parseSimpleQuery('json', node, 'json');
const array = parseSimpleQuery('array', node, 'json');
const innerHtml = parseSimpleQuery('innerHtml', node, 'innerHTML');
const outerHtml = parseSimpleQuery('outerHtml', node, 'outerHTML');


test('boolean: true', () => expect(booleanTrue).toEqual(true));
test('boolean: false', () => expect(booleanFalse).toBe(false));
test('string', () => expect(string).toBe('lorem ipsum'));
test('int', () => expect(int).toBe(12));
test('decimal', () => expect(decimal).toBe(34.567));
test('json', () => expect(json).toEqual({ entry: 'Hello', leave: 'Goodbye' }));
test('array', () => expect(array).toEqual(['Hello', 'Goodbye']));
test('innerHTML', () => expect(innerHtml).toEqual('Hello world!'));
