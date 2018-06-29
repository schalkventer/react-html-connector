import decodeHtmlEntities from './../decodeHtmlEntities';


const input = '&lt;div data-value=&quot;30&quot;&gt;£ 3000 &amp; &yen; 2018&lt;/div&gt;';
const output = '<div data-value="30">£ 3000 & ¥ 2018</div>';


test('true', () => expect(decodeHtmlEntities(input)).toBe(output));