#### new 操作符到底做了什么？
- 问new一个对象的时候，都执行了什么？
1. 创建了一个新的对象
2. 设置原型，将对象的原型设置为函数的 prototype 对象
3. 执行这个构造函数中的代码，绑定`this`到这个对象;
4. 返回一个对象
这段话大家应该比较熟悉吧，但是这里面是怎么实现的呢，让我们来探究一下：

```js
function _New(){
    // 创建了一个新的对象
    let newObject = null,result=null;
    // 获取构造函数 constructor
    const constructor = Array.prototype.shift.call(arguments);
    // 判断参数是否是一个函数
    if (typeof constructor !== "function") {
        console.error("type error");
        return;
    }
    // 设置该对象的原型为构造函数的
    newObject = Object.create(constructor.prototype);
    result = constructor.apply(newObject,arguments);
    const flag = result && typeof result==='object' || typeof result==='function';
    return flag ? result : newObject;
}
```
测试一下：
1. test-1
```js
function Test(name){
    this.name = name || 'test';
}
let test = _New(Test,11);
console.log(test.name) //11
```
2. test-2
```js
function Test(name){
    this.name = name || 'test';
    return 1
}
let test = _New(Test,11);
console.log(test.name) // 11
```
3. test-3
```js
function Test(name){
    this.name = name || 'test';
    return {
        age:18
    }
}
let test = _New(Test,11);
console.log(test.name) // undefined
```
综上最后一点返回一个对象应该是不准确的；应该是判断构造函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。