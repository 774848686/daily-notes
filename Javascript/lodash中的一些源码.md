#### lodash 中一些源码实现
- _.slice 
```js
/* var array = [1, 2, 3, 4]
 * _slice(array, 2)
 * // => [3, 4]
 */
// 1. 首先需要判断传入的对象是不是一个数组，然后获取其length长度
// 2. 确定start 跟end 的值，以及小于0时候的处理
// 3. 根据start end 的值来获取截取区间
// 4. 遍历这个区间进行目标数组的创建
function _slice(array, start, end) {
    let length = array == null ? 0 : array.length;
    if (!length) return [];
    start = start === undefined ? 0 : start;
    end = end === undefined ? length : end;
    if (start < 0) {
        start = -start > length ? 0 : (length + start);
    }
    end = end > length ? length : end;
    if (end < 0) {
        end += length
    }
    let sliceLen = 0,
        index = -1,
        result = [];
    sliceLen = start > end ? 0 : ((end - start) >>> 0);
    while (++index < sliceLen) {
        result.push(array[start + index])
    }
    return result;
}
var array = [1, 2, 3, 4];
console.log(_slice(array, 2))
```
注意这个知识点：`((end - start) >>> 0)`表示取正整数;思考一个问题为什么不直接使用数组的`slice`方法：
因为`_.slice`想得到一个`密集数组`(至少元素是undefined);而`slice`返回的是一个`稀疏数组`;
```js
var a = new Array(10);
a.slice(0,1); // [empty]
_slice(a,0,1) // [undefined]
```
- _.chunk()

```js
/*
*  _.chunk
* chunk(['a', 'b', 'c', 'd'], 2)
* // => [['a', 'b'], ['c', 'd']]
*/
function _chunk(array, size = 1) {
   let length = array == null ? 0 : array.length;
   if (!length || size < 1) {
       return [];
   }
   let partCount = Math.ceil(length / size);
   let index = 0,
        resIndex = 0,
       result = new Array(partCount);
   while (index < length) {
       result[resIndex++] = _slice(array, index, index+=size)
   }
   return result;
}
console.log(_chunk(['a', 'b', 'c', 'd'], 2))
console.log(_chunk(['a', 'b', 'c', 'd'], 1))
```
- _.concat()
```js
/**
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 * => [1, 2, 3, [4]]
 */
function _concat(array, ...args) {
    let result = null;
    if (!args.length) return Array.from(array);
    result = args.reduce((pre, cur) => {
        if (Array.isArray(cur)) {
            return [...pre, ...cur];
        } else {
            return pre.concat(cur)
        }
    }, [])
    return [...array, ...result]
}
let array = [1];
console.log(_concat(array, 2, [3], [
    [4]
]))
let array2 = [1, 2, 3];
console.log(_concat(array2))
```
- _.flatten()
```js
/**
 *  flatten([1, [2, [3, [4]], 5]])
 *  => [1, 2, [3, [4]], 5]
 */
function baseFlatten(array, depth, result = []) {
    if (array == null) {
        return result
    }

    for (const value of array) {
        if (depth > 0 && Array.isArray(value)) {
            if (depth > 1) {
                // Recursively flatten arrays (susceptible to call stack limits).
                baseFlatten(value, depth - 1, result)
            } else {
                result.push(...value)
            }
        } else {
            result[result.length] = value
        }
    }
    return result
}

function _flatten(array) {
    return Array.isArray(array) ? baseFlatten(array, 1) : [];
}
console.log(_flatten([1, [2],
    [
        [3]
    ]
]))
```
- _.flattenDepth()
```js
function _flattenDepth(array,depth){
    depth = depth === undefined ? 1 : +depth
    return Array.isArray(array) ? baseFlatten(array, depth) : [];
}

```
- _.flattenDeep()
```js
function _flattenDeep(array){
    const INFINITY = 1 / 0
    return Array.isArray(array) ? baseFlatten(array, INFINITY) : [];
}
```
- _.difference()
```js
/**
 * _.difference([3, 2, 1], [4, 2]);
 * => [3, 1]
 */
// function _difference(array,values){
//     return array.filter(item=>!values.includes(item))
// }
function _difference(array, values) {
    return baseDifference(array, values)
}

function baseDifference(array, values, iteratee) {
    let index = -1,
        result = [],
        length = array.length,
        valuesLength = values.length;
    if (iteratee) {
        values = arrayMap(values, iteratee);
    }
    outer:
        while (++index < length) {
            var value = array[index],
                computed = iteratee ? iteratee(value) : value;

            if (computed === computed) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                    if (values[valuesIndex] === computed) {
                        continue outer;
                    }
                }
            }
            result.push(value);
        }
    return result;

}
// console.log(_difference([3, 2, 1, 2, 5], [4, 2]));
/**
 * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
 * => [3.1, 1.3]
 */
function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
        result[index] = iteratee(array[index]);
    }
    return result;
}

function baseProperty(key) {
    return function (object) {
        return object == null ? undefined : object[key];
    };
}

function baseIteratee(value) {
    var type = typeof value;
    if (type == 'function') {
        return value;
    }
    if (value == null) {
        return identity;
    }
    return baseProperty(value);
}

function getIteratee() {
    var result = baseIteratee;
    return arguments.length ? result(arguments[0], arguments[1]) : result;
}

function _differenceBy(array, values, iteratee) {
    return baseDifference(array, values, getIteratee(iteratee))
}
console.log(_differenceBy([{
    'x': 2
}, {
    'x': 1
}], [{
    'x': 1
}], 'x'))
console.log(_differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor))
console.log(_differenceBy([5, 10, 11], [20], function (a1) {
    return a1 % 5;
}))
```
