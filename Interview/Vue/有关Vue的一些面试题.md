> 面试当中肯定会被问到有关`Vue`的一些问题，在这里我收集了一些题目，写下自己的回答，进行一次自我面试。【如果涉及到Vue3.0会进行标注，否则默认2.X】
- Vue中为什么采用异步渲染？
1. `Vue`中的响应式数据发生变化后，会触发`dep.notify()`方法通知`渲染watcher`进行更新操作；`watcher` 中的`update`方法会将当前的渲染`watcher`放入到一个队列中；这里`Vue`会给`渲染watcher`标记一个uid，如果是相同的则只要添加一次即可；

2. 设想一下，如果`Vue`并没有采取异步渲染，那么多次更新数据都要进行了一次渲染，这样性能就会很差。出于性能考虑，`Vue`采取了异步渲染方式；顺便说下，因为是异步渲染，所以我们更新数据后不能马上获取到`dom`上最新的值，如果有需求可用`nextTick`;

- 说一下nextTick的原理？
1. 涉及的知识点有`宏任务`、`微任务`；浏览器`事件循环`中遇到同步任务直接执行，异步任务分为`宏任务`、`微任务`，执行顺序是首先执行同步任务然后将`宏任务`添加到`宏任务`队列,在执行所有的`微任务`,完毕后又会执行新的`宏任务`,依次类推下去。
```js
// 这是一个同步任务
console.log('1')         
// 这是一个宏任务
setTimeout(function () {   
  console.log('2')                   
});
new Promise(function (resolve) {
  // 这里是同步任务
  console.log('3');        
  resolve();                        
  // then是一个微任务
}).then(function () {      
  console.log('4')                   
  setTimeout(function () {
    console.log('5')
  });
});
```
2. `nextTick`就是把我们的视图更新的操作塞到一个`微任务`或者`宏任务`中，来进行异步执行；`Vue`中首先检测是否支持`promise`,支持则进行`promise.then(flushCallbacks)`执行回调，否则看是否支持`MutationObserver`,支持则进行` new MutationObserver(flushCallbacks)`,否则看是否支持`setImmediate`支持则进行`setImmediate(flushCallbacks)`,否则进行`setTimeout(flushCallbacks, 0)`;

- 谈一谈Vue中的响应式原理
1. Vue中的响应式是其一大特色，何为响应式？就是我们由数据来驱动视图的更新。一旦发现我们所依赖的数据发生了变化，我们的视图就会执行更新；这带来的好处就是我们只要关心数据这一层就好，不用过多的关心视图层的变化。

2. Vue中的响应式核心方法就是使用ES5中`Object.defineProperty`对数据操作进行‘劫持’，在读取数据的时候会执行`get`方法，然后进行`依赖收集`操作,每个依赖收集当前的`渲染watcher`或者`计算watcher`；收集的过程会形成一个相互映射关系，每个`watcher`会收集对应的依赖，每个依赖会收集当前的`watcher`;当我们进行数据修改操作的时候会执行`set`方法，这个方法将会通知该依赖的所有`watcher`触发`update`方法进行视图更新；当然Vue2.X中的响应式还是存在一些不可为的东西，比如数据的索引直接赋值，就不会进行响应式；当然Vue2.X中也提供了如`Vue.$set`、`Vue.$delete`方法进行间接的进行响应式；在Vue3.X中使用了`Proxy`则解决了这个问题；

- 你知道Vue中是如何检测数组响应式变化？
1. Vue中初始化的时候会对数据进行了递归遍历，让每个属性值进行响应式，如果是数组则遍历每一项进行响应式处理；

2. 对于数据的新增、删除等原生方法操作，我觉得Vue比较很巧妙的进行了处理；利用改写数组的原型链的方法，从而拦截了`push`、`delete`、`splice`原生方法；这是怎么实现的呢？伪代码如下：

```js
// array.js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
...
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
// observe.js
...
if (hasProto) { // 判断浏览器是否兼容 __prop__ 
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src // 完成数组的原型链修改, 从而使得数组变成响应式的 ( pop, push, shift, unshift, ... )
  /* eslint-enable no-proto */
}
...
```
通过进行原型链的拦截，我们给每次添加的值进行响应式然后手动触发更新；Vue中的`Vue.$set`、`Vue.$delete`实现的原理也就是通过数组的`splice`进行实现；