> 你好，我是本次的面试官，我想问你一些关于JavaScript中面试题目，
- 你给我讲一下什么是原型么？ 

每个构造函数都会有一个`prototype`属性，这个属性指向了一个原型对象。原型对象里面会有一个`construtor`属性指向这个构造函数；每个对象可通过`_proto_`指向对象原型。举个例子：
```js
function Persion(){

}
let persion = new Persion();
consoe.log(persion._proto_===Persion.prototype) //true
console.log(Persion.prototype.construtor===Persion) //true
```
当读取实例的属性和方法的时候，如果读取不到就会找实例原型上是否有，如果还是没有读取到就会找实例原型的原型，一直找到最顶端`null`;这就构成了原型链。举个例子：
```js
function Persion(){

}
Persion.prototype.name = 'test-name';
let persion = new Persion();
console.log(persion.name)
```
- 你能给我再讲一下什么是继承？
继承有很多方式，这里我列举一下：
1. 读取属性方法通过原型往上搜寻的原理，可进行原型链继承，比如：
```js
function Persion(){
    this.attrs = ['name'];
}
Persion.prototype.getAttr = function(){
    console.log(this.attrs);
}
function Child(){

}
Child.prototype = new Persion();
let child = new Child();
child.getAttr();
child.attrs.push('age');

let child2 = new Child();
child2.getAttr();
```
由上面的代码运行结果得知，这样我们所有的实例都会共享父类属性，某一个修改了属性会导致所有的实例数据变化。
2. 构造函数继承
```js
function Persion(attr){
    this.attr = [attr];
    this.getFirstAttrName=()=>{
        return this.attr[0];
    }
    this.getAtt = ()=>{
        return this.attr;
    }
}
Persion.prototype.getAttr = function(){
    console.log(this.attr)
}
function Child(name){
    Persion.call(this,name)
}
let child = new Child('name')
//console.log(child.getAttr()); // child.getAttr is not a function
console.log(child.getFirstAttrName())
child.attr.push('age')
let child2 = new Child('teat')
console.log(child2.getAtt())
```
这样能够解决数据共享的问题，但是构造函数内需要定义方法，而且每次实例时候都要重新创建这些方法。
3. 组合式继承
```js
function Persion(name){
    this.attr = [name]
}
Persion.prototype.getAttr = function(){
    console.log(this.attr)
}
function Child(name){
    Persion.call(this,name)
}
Child.prototype = new Persion();
let child = new Child('name');
child.attr.push('age');
child.getAttr();
let child2 = new Child('name2');
child2.getAttr();
```
组合式这种有个弊端就是，Persion构造函数需要调用两次；
3. 寄生组合式继承-间接让child.prototype指向parent.prototype
```js
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    console.log(this.name)
}
function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}
// 关键的三步
var F = function () {};
F.prototype = Parent.prototype;
Child.prototype = new F();
var child1 = new Child('kevin', '18');
console.log(child1);
```
JavaScript高级程序设计中这么评价寄生组合式继承：这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。
- 你能说说new操作符发生了什么吗？
  
用几句话概括就是：1.创建了一个新的对象；2.将这个对象的原型指向了函数的prototype属性；3.执行了函数内方法以及绑定了this到这个对象；4.返回这个对象；具体的实现如下：
```js
function _new(){
    let newObject = null,result = null;
    const F = Array.prototype.shift.call(argument);
    if(typeof F !=='function'){
        return new throw('is not a function')
    }
    newObject = Object.create(F.prototype);
    result = newObject.apply(newObject,arguments)
    const flag = result && typeof result==='object' || typeof result==='function';
    return flag ? result : newObject;
}
```
补充的是，如果构造函数返回的是一个对象或者一个函数的时候，这时候new 返回的并不是一个创建对象而是构造函数返回的对象；
- 你能解释一下什么是作用域吗？
简单的说，作用域就是一个可访问变量的集合。当代吗执行的时候，就会创建一个执行上下文，当访问一个变量的时候，他首先会在当前的执行环境进行查找，当找不到的时候会沿着父级执行上下文一层层往上查找。这样的多个执行上下文的变量对象组合成了作用域链。
<br>每个执行上下文，都会有三个重要的属性：
1. 变量对象(VO)
2. 作用域链(Scope chain)
3. this
<br>举个例子:

```js
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```
执行过程如下：
1. `checkscope`函数被创建，保存作用域链到内部属性[[scope]]
```js
checkscope.[[scope]] = [
    globalContext.VO
]
```
2. 执行`checkscope`函数，创建执行函数的上下文被压入执行上下文栈：// 先进后出
```js
ECStack = [
    checkscopeContext,
    globalContext
];
```
3. `checkscope`函数不会立即执行，而是要进行执行前的准备，复制函数[[scope]]属性创建作用域。
```js
checkscopeContext = {
    Scope:checkscope.[[scope]],
}
```
4. 创建活动变量对象，比如初始化实参、形参变量声明以及函数声明；
```js
checkscopeContext = {
    Scope:checkscope.[[scope]],
    VO:{
        arguments: {
            length: 0
        },
        scope2:undefined
    }
}
```
5. 将该活动对象压入作用域链顶端：
```js
checkscopeContext = {
    VO:{
        arguments: {
            length: 0
        },
        scope2:undefined
    },
    Scope:[AO,[[scope]]]
}
```
6. 准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值
```js
checkscopeContext = {
    VO:{
        arguments: {
            length: 0
        },
        scope2:'local scope'
    },
    Scope:[AO,[[scope]]]
}
```
7. 查找到 `scope2` 的值，返回后函数执行完毕，函数上下文从执行上下文栈中出栈
```js
ECStack = [
    globalContext
];
```
综上代码执行时候，就是一个反复压栈出栈的过程。<font color=red>这里闭包的的产生的具体原因就是返回函数的`Scope`保存了对父级执行函数的AO引用，虽然父级函数上下文已经出栈，但是js对其AO进行了保存。</font>
<br> 我们再来看看什么叫做执行上下文：<br>
我们代码在执行的时候，都是自上而下运行。由上我们知道当一个函数执行时候就会创建执行上下文，那么多的执行上下文是如何进行管理的呢？JavaScript引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文；我们可以把这个执行上下文栈当做一个数组，遇到函数执行就把创建的执行上下文进行压栈。首先遇到的是全局代码，向栈中压入 `globalContext`

```js
ECStack = [
    globalContext
];
```
举个例子：
```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```
这段代码的执行过程是这样的：

```js
ECStack.push(<checkscope> functionContext);
ECStack.push(<f> functionContext);
ECStack.pop();
ECStack.pop();
```
我们再来看看什么叫做变量对象：<br>
举个例子：
```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```
当前执行上下文的准备阶段AO如下：
```js
fooScopeContext = {
    AO:{
        arguments:{
            length:1
        },
        a:1,
        b:undefined,
        c:reference to function c(){},
        d: undefined
    }
}
```
执行上下文变成：
```js
fooScopeContext = {
    AO:{
        arguments:{
            length:1
        },
        a:1,
        b:3,
        c:reference to function c(){},
        d: reference to FunctionExpression "d"
    }
}
```
有趣的一道理解题：
```js
function foo() {
    console.log(a);
    a = 1;
}

foo(); // ???

function bar() {
    a = 1;
    console.log(a);
}
bar(); // ???
```
第一题因为没有`var`,所以a不会放到AO中，所以打印不出a。报错<font color=red>Uncaught ReferenceError: a is not defined</font>,第二题会创建一个全局a，所以能够打印出来。
- 你能说下`instanceof`操作符的实现原理么？
`instanceof`是判断实例`_proto_`是否是指向函数原型或者指向函数父级往上原型对象。
```js
function instanceof(leftSource,rightTarget){
    let rightPrototype = rightTarget.prototype;
    let leftProto = leftSource._proto_;
    while(true){
        if(leftProto ==null){
            return false;
        }
        if(leftProto===rightPrototype){
            return true;
        }
        leftProto = leftProto._proto_
    }
}
```




  