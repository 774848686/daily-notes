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
- 您能说说new操作符发生了什么吗？
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
  