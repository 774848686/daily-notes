#### 手写call、apply、bind函数
- call的用法
1. `call`参数说明：
```
call('需绑定的this对象',args1,args2,...)
```

```js
let a = {
    name: 'a'
}
function testCall(a,b) {
    console.log(a,b)
    console.log(this.name);
}
testCall.call(a,1,2)
```
2. 手动实现
`testCall.call(a,1,2)`相当于是a.fn(1,2),这个fn就是前面这个`testCall`函数，实现如下：
```js
Function.prototype.call = function(context,...args){
    if (typeof this !== 'function') {
        throw new TypeError('not a function')
    }
    context = context || window;
    context.fn = this;
    let result = eval(`context.fn(...args)`);
    delete context.fn;
    return result;
}
```
- apply的用法
1. `apply`参数说明：
```
apply('需绑定的this对象',[args1,args2,...])
```
`apply`跟`call`的用法差不多就是参数上的区别，实现上也大同小异。实现如下：
```js
Function.prototype.apply = function(context,...args){
    if (typeof this !== 'function') {
        throw new TypeError('not a function')
    }
    const context = context || window;
    context.fn = this;
    let result = arguments[1] ? context.fn(...arguments[1]) : context.fn();
    delete context.fn;
    return result;
}
```
- bind的用法
1. `bind`参数说明：
`bind`函数接受一个绑定对象，以及参数最后返回一个新的函数，再进行调用；参数跟`call`函数类似，所以我们可用`call`来实现`bind`；
```js
const t_b = testBind.bind(a, 'a', 'n');
t_b(222);
```
实现如下：
```js
Function.prototype.bind = function(context){
    context = context || window;
    let self = this;
    let args1 =  Array.prototype.slice.call(arguments, 1);
    return function(){
        let args2 = Array.prototype.slice.call(arguments, 1);
        let agrsmerge = [...args1,...args2];
       return self.call(context,...agrsmerge)
    }
}
```

