import { JSDOM } from 'jsdom';
import convertToArray from './../convertToArray';


const dom = new JSDOM('<!DOCTYPE html><div class="test">1</div><div class="test">2</div><div class="test">3</div>');
const nodesList = dom.window.document.getElementsByClassName('test');
const input = convertToArray(nodesList);

test('Result is array', () => expect(input.length).toBeGreaterThan(0));
test('First item to correspont to first node', () => expect(input[0].innerHTML).toBe('1'));
