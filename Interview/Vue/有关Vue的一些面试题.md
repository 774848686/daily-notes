> 面试当中肯定会被问到有关`Vue`的一些问题，在这里我收集了一些题目，写下自己的回答，进行一次自我面试。
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
2. `nextTick`就是把我们的视图更新的操作塞到一个`微任务`或者`宏任务`中，来进行异步执行；`Vue`中首先检测是否支持`promise`,支持则进行`promise.then(flushCallbacks)`执行回调，否则看是否支持`MutationObserver`,支持则进行` new MutationObserver(flushCallbacks)`,否则看是否支持`setImmediate`支持则进行`setImmediate(flushCallbacks)`,否则进行`setTimeout(flushCallbacks, 0)`