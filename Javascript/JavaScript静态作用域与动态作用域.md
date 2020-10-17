### 作用域
作用域顾名思义就是变量作用在一定区域，且能通过某种规则进行查找；而JS中采用的是静态作用域(词法作用域)；
#### 静态作用域
静态作用域的意思是函数在定义的时候就已经确定好了作用域，之后不论在何处进行调用都只会首先在定义的区域中查找该变量：与之相对的就是动态作用域；就是函数运行的时候去动态确定。我们先看以下的🌰：
```js
function foo(){
    console.log(a);
}
function bar(){
    var a = 3;
    foo();
}
var a = 2;
bar();
```
分析下：有人可能会觉得根据js的词法作用域链查找规则，如果`a`在`foo`函数内部没找到会沿着作用域链往上查找会找到`bar`函数内部，所以输出的是3；但是事实上js并不具有动态作用域，他只有词法作用域。他是在函数定义的时候沿着作用域链往上查找对全局变量`a`进行了引用，所以在`bar`中去调用，这层引用关系是不变的。改变一下：
```js
function bar(){
    var a = 3;
    function foo(){
        console.log(a);
    }
    foo()
}
var a = 2;
bar();
```
这时候就会输出3，具体的原因我想你也应该知道了；
#### 思考一下
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
```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```
