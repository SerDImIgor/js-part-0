"use strict";
// Test utils
const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};
// Some type
// Standart type
var standartType;
(function (standartType) {
    standartType["boolean"] = "boolean";
    standartType["string"] = "string";
    standartType["object"] = "object";
    standartType["function"] = "function";
    standartType["undefined"] = "undefined";
    standartType["number"] = "number";
    standartType["symbol"] = "symbol";
    standartType["bigint"] = "bigint";
})(standartType || (standartType = {}));
// real type
var extendType;
(function (extendType) {
    extendType["String"] = "String";
    extendType["Date"] = "Date";
    extendType["Set"] = "Set";
    extendType["Array"] = "Array";
    extendType["Boolean"] = "Boolean";
    extendType["null"] = "null";
    extendType["RegExp"] = "RegExp";
    extendType["NaN"] = "NaN";
    extendType["Infinity"] = "Infinity";
})(extendType || (extendType = {}));
function areEqual(a, b) {
    if (typeof (a) === 'number' && typeof (b) === 'number') {
        let aa = a;
        let bb = b;
        return aa === bb;
    }
    else if (typeof (a) === 'string' && typeof (b) === 'string') {
        let aa = a;
        let bb = b;
        return aa === bb;
    }
    else if (typeof (a) === 'boolean' && typeof (b) === 'boolean') {
        let aa = a;
        let bb = b;
        return aa === bb;
    }
    else if (typeof (a) === 'object' && typeof (b) === 'object') {
        let aa = a;
        let bb = a;
        if (aa.length !== bb.length) {
            return false;
        }
        for (let i = 0; i < aa.length; i++) {
            return areEqual(aa[i], bb[i]);
        }
    }
    return false;
}
;
const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    }
    else {
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
    return standartType[typeof value];
    // Return string with a native JS type of value
};
const getTypesOfItems = (arr) => {
    return arr.map((value) => getType(value));
    // Return array with types of items of given array
};
const getRealType = (value) => {
    if (typeof value === 'object') {
        if (value instanceof String) {
            return extendType.String;
        }
        else if (value instanceof Date) {
            return extendType.Date;
        }
        else if (value instanceof Set) {
            return extendType.Set;
        }
        else if (value instanceof Array) {
            return extendType.Array;
        }
        else if (value instanceof Boolean) {
            return extendType.Boolean;
        }
        else if (value === null) {
            return extendType.null;
        }
        else if (value instanceof RegExp) {
            return extendType.RegExp;
        }
        return standartType.object;
    }
    else if (typeof value === 'number') {
        if (isNaN(value) === true) {
            return extendType.NaN;
        }
        else if (value === Infinity) {
            return extendType.Infinity;
        }
        return standartType.number;
    }
    return getType(value);
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
    const realTypeElement = new Set(arr.map((value) => getRealType(value)));
    return realTypeElement.size === 1;
    // Return true if all items of array have the same type
};
const getRealTypesOfItems = (arr) => {
    // Return array with real types of items of given array
    return arr.map((value) => getRealType(value));
};
const everyItemHasAUniqueRealType = (arr) => {
    const uniqueItems = new Set(getRealTypesOfItems(arr));
    return uniqueItems.size === arr.length;
    // Return true if there are no items in array
    // with the same real type
};
const countRealTypes = (arr) => {
    const realTypeItem = getRealTypesOfItems(arr);
    realTypeItem.sort();
    const arrayResult = [];
    let cntElement = 1;
    let value = realTypeItem[0];
    for (let i = 1; i < realTypeItem.length; i++) {
        const currentValue = realTypeItem[i];
        if (currentValue === value) {
            cntElement += 1;
        }
        else {
            arrayResult.push([value, cntElement]);
            cntElement = 1;
        }
        value = currentValue;
    }
    arrayResult.push([value, cntElement]);
    return arrayResult;
    // Return an array of arrays with a type and count of items
    // with this type in the input array, sorted by type.
    // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
};
// Tests
testBlock('getType');
test('Boolean', getType(true), standartType.boolean);
test('Number', getType(123), standartType.number);
test('String', getType('whoo'), standartType.string);
test('Array', getType([]), standartType.object);
test('Object', getType({}), standartType.object);
test('Function', getType(() => { }), standartType.function);
test('Undefined', getType(undefined), standartType.undefined);
test('Null', getType(null), standartType.object);
testBlock('allItemsHaveTheSameType');
test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);
test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);
test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);
test('Values like a number', allItemsHaveTheSameType([123, 123 / 0, 1 / 0]), false);
test('Values like an object', allItemsHaveTheSameType([{}]), true);
testBlock('getTypesOfItems VS getRealTypesOfItems');
const knownTypes = [
    5 > 3,
    324,
    'Hello',
    [],
    {},
    function v() { },
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
    standartType.boolean,
    standartType.number,
    standartType.string,
    standartType.object,
    standartType.object,
    standartType.function,
    standartType.undefined,
    standartType.object,
    standartType.number,
    standartType.number,
    standartType.object,
    standartType.object,
    standartType.object,
    standartType.object,
    standartType.symbol,
]);
test('Check real types', getRealTypesOfItems(knownTypes), [
    standartType.boolean,
    standartType.number,
    standartType.string,
    extendType.Array,
    standartType.object,
    standartType.function,
    standartType.undefined,
    extendType.null,
    extendType.NaN,
    extendType.Infinity,
    extendType.Date,
    extendType.RegExp,
    extendType.Set,
    extendType.Boolean,
    standartType.symbol,
    // What else?
]);
testBlock('everyItemHasAUniqueRealType');
test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);
test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, 3 < 2]), false);
test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);
testBlock('countRealTypes');
test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    [standartType.boolean, 3],
    [extendType.null, 1],
    [standartType.object, 1],
]);
test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    [standartType.boolean, 3],
    [extendType.null, 1],
    [standartType.object, 1],
]);
// Add several positive and negative tests
