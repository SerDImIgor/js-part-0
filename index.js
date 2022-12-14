// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};
const arraysEqual = (a, b) => {
    return a.length === b.length && a.every((el, ix) => el === b[ix]);
};

const areEqual = (a, b) => {
    const flagA = Array.isArray(a);
    const flagB = Array.isArray(b);
    if (flagA && flagB) {
        if (Array.isArray(a[0]) && Array.isArray(b[0])) {
            const convertToString = (value) => {
                return `${value[0]}_${value[1]}`;
            };
            const strArrayA = a.map(convertToString);
            strArrayA.sort();
            const strArrayB = b.map(convertToString);
            strArrayB.sort();
            return arraysEqual(strArrayA, strArrayB);
        }
        return arraysEqual(a, b);
    } else if (!flagA && !flagB) {
        return a === b;
    }
    return false;
    // Compare arrays of primitives
    // Remember: [] !== []
};

const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value) => {
    return typeof value;
    // Return string with a native JS type of value
};

const getTypesOfItems = (arr) => {
    const typeForElement = (value) => {
        return getType(value);
    };
    return arr.map(typeForElement);
    // Return array with types of items of given array
};

const getRealType = (value) => {
    if (typeof value === 'object') {
        if (value instanceof String) {
            return 'String';
        } else if (value instanceof Date) {
            return 'Date';
        } else if (value instanceof Set) {
            return 'Set';
        } else if (value instanceof Array) {
            return 'Array';
        } else if (value instanceof Boolean) {
            return 'Boolean';
        } else if (value instanceof Symbol) {
            return Symbol;
        } else if (value === null) {
            return 'null';
        } else if (value instanceof RegExp) {
            return 'RegExp';
        }
        return 'object';
    } else if (typeof value === 'number') {
        if (isNaN(value) === true) {
            return 'NaN';
        } else if (value === Infinity) {
            return 'Infinity';
        }
        return 'number';
    }
    return typeof value;

    // Return string with a “real” type of value.
    // For example:
    //     typeof new Date()       // 'object'
    //     getRealType(new Date()) // 'date'
    //     typeof NaN              // 'number'
    //     getRealType(NaN)        // 'NaN'
    // Use typeof, instanceof and some magic. It's enough to have
    // 12-13 unique types but you can find out in JS even more :)
};

const allItemsHaveTheSameType = (arr) => {
    const typeForElement = (value) => {
        return getRealType(value);
    };
    const realTypeElement = new Set(arr.map(typeForElement));
    if (realTypeElement.size === 1) {
        return true;
    }
    if (realTypeElement.size === 2) {
        const iterator = realTypeElement.values();
        const valueFr = iterator.next().value;
        const valueSc = iterator.next().value;
        if (valueFr.toLowerCase() === valueSc.toLowerCase()) {
            return false;
        }
    }
    return false;
    // Return true if all items of array have the same type
};

const getRealTypesOfItems = (arr) => {
    // Return array with real types of items of given array
    const typeForElement = (value) => {
        return getRealType(value);
    };
    return arr.map(typeForElement);
};

const everyItemHasAUniqueRealType = (arr) => {
    const uniqueItems = new Set(getRealTypesOfItems(arr));
    return uniqueItems.size === arr.length;
    // Return true if there are no items in array
    // with the same real type
};

const countRealTypes = (arr) => {
    const realTypeItem = getRealTypesOfItems(arr);
    const uniqueItems = new Set(getRealTypesOfItems(arr));
    const arrayResult = [];
    const element = (value) => {
        arrayResult.push([value, realTypeItem.filter((x) => x === value).length]);
    };
    uniqueItems.forEach(element);
    return arrayResult;
    // Return an array of arrays with a type and count of items
    // with this type in the input array, sorted by type.
    // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);

test('Values like a number', allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]), false);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    5 > 3,
    324,
    'Hello',
    [],
    {},
    function v() {},
    undefined,
    null,
    NaN,
    Infinity,
    new Date(),
    new RegExp(''),
    new Set(),
    new Boolean(),
    Symbol('Hi'),
    // Add values of different types like boolean, object, date, NaN and so on
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'function',
    'undefined',
    'object',
    'number',
    'number',
    'object',
    'object',
    'object',
    'object',
    'symbol',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'Array',
    'object',
    'function',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'Date',
    'RegExp',
    'Set',
    'Boolean',
    'symbol',
    // What else?
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

// Add several positive and negative tests
// Just test
// comments
