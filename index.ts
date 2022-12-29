// Test utils

const testBlock = (name: string):void => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

// Some type
// Standart type
enum standartType {
    boolean = 'boolean',
    string = 'string',
    object = 'object',
    function = 'function',
    undefined = 'undefined',
    number = 'number',
    symbol = 'symbol',
    bigint = 'bigint'

}
// real type
enum extendType {
    String = 'String',
    Date = 'Date',
    Set = 'Set',
    Array = 'Array',
    Boolean = 'Boolean',
    null = 'null',
    RegExp = 'RegExp',
    NaN = 'NaN',
    Infinity = 'Infinity'
}
type realType = extendType | standartType;
function areEqual(a:boolean, b:boolean):boolean ;
function areEqual(a:number, b:number):boolean ;
function areEqual(a:string, b:string):boolean ;
function areEqual(a:number[], b:number[]):boolean ;
function areEqual(a:string[], b:string[]):boolean ;
function areEqual(a:unknown, b:unknown):boolean ;
function areEqual(a:unknown, b: unknown):boolean {
    if (typeof(a)==='number' && typeof(b)==='number')
    {
        let aa = a as number;
        let bb = b as number;
        return aa === bb;
    } else if(typeof(a)==='string' && typeof(b)==='string')
    {
        let aa = a as string;
        let bb = b as string;
        return aa === bb;

    } else if(typeof(a)==='boolean' && typeof(b)==='boolean')
    {
        let aa = a as boolean;
        let bb = b as boolean;
        return aa === bb;

    } else if(typeof(a)==='object' && typeof(b)==='object')
    {
        let aa = a as Array<unknown>;
        let bb = a as Array<unknown>;
        if (aa.length !== bb.length) {
            return false;
        }
        for(let i:number = 0;i<aa.length;i++)
        {
            return areEqual(aa[i] ,bb[i]);
        }
    }
    return false;
};

const test = (whatWeTest:string, actualResult : unknown, expectedResult:unknown): void => {
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
const getType = (value:any): standartType => {
    return standartType[typeof value];
    // Return string with a native JS type of value
};

const getTypesOfItems = (arr: any[]): standartType[] => {
    return arr.map((value) => getType(value));
    // Return array with types of items of given array
};

const getRealType = (value:any) :realType => {
    if (typeof value === 'object') {
        if (value instanceof String) {
            return extendType.String;
        } else if (value instanceof Date) {
            return extendType.Date;
        } else if (value instanceof Set) {
            return extendType.Set;
        } else if (value instanceof Array) {
            return extendType.Array;
        } else if (value instanceof Boolean) {
            return extendType.Boolean;
        } else if (value === null) {
            return extendType.null;
        } else if (value instanceof RegExp) {
            return extendType.RegExp;
        }
        return standartType.object;
    } else if (typeof value === 'number') {
        if (isNaN(value) === true) {
            return extendType.NaN;
        } else if (value === Infinity) {
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

const allItemsHaveTheSameType = (arr:any[]):boolean => {
    const realTypeElement:Set<realType> = new Set(arr.map((value) => getRealType(value)));
    return realTypeElement.size === 1;
    // Return true if all items of array have the same type
};

const getRealTypesOfItems = (arr:any[]):realType[] => {
    // Return array with real types of items of given array
    return arr.map((value) => getRealType(value));
};

const everyItemHasAUniqueRealType = (arr:any[]):boolean => {
    const uniqueItems:Set<realType> = new Set(getRealTypesOfItems(arr));
    return uniqueItems.size === arr.length;
    // Return true if there are no items in array
    // with the same real type
};

const countRealTypes = (arr:any[]):[realType,number][] => {
    const realTypeItem:realType[] = getRealTypesOfItems(arr);
    realTypeItem.sort();
    const arrayResult:[realType,number][] = [];
    let cntElement:number = 1;
    let value:realType = realTypeItem[0];
    for (let i = 1; i < realTypeItem.length; i++) {
        const currentValue = realTypeItem[i];
        if (currentValue === value) {
            cntElement += 1;
        } else {
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
test(
    'Function',
    getType(() => {}),
    standartType.function
);
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
