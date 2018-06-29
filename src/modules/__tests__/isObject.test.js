import isObjectLiteral from './../isObjectLiteral';


test('Pass array', () => expect(isObjectLiteral([])).toBe(false));
test('Pass object', () => expect(isObjectLiteral({})).toBe(true));
test('Pass null', () => expect(isObjectLiteral(null)).toBe(false));
test('Pass number', () => expect(isObjectLiteral(1)).toBe(false));
