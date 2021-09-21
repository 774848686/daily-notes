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

- 说一说Vue中的watch
1. 首先说下什么是`watch`，就是一个响应式数据的监听器，一旦监听的数据发生变化，就会触发回调函数进而做一些复杂的逻辑处理；

2. 具体的用法如下：
```js
...
let app = new Vue({
    el: '#root',
    data() {
        return {
            msg: 'hello world'
        }
    },
    created() {

    },
    methods: {
        changeMsg() {
            this.msg = 'hello world!'
        }
    },
    watch: {
        msg(value) {
            console.log('value change', value)
        }
    }
})
...
```
还有一些高级点的用法：比如是否立即执行`immediate:true`,是否进行深度监听`deep:true`; 这里就不赘述，可以去官网查看；

3. 实现原理<br/>
首先`Vue` 在初始化`initState`方法的时候进行检测是否有用户写的`watch`,如果有则进入`initWatch`方法；
```js
function initState(vm){
  ...
   if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  ...
}
```
在`initWatch`方法中，对`opts.watch`进行遍历创建`watcher`;调用了`createWatcher(vm, key, handler)`
```js
function createWatcher(vm, key, handler){
  ...
  return vm.$watch(expOrFn, handler, options)
}
```
好了最终我们通过`vm.$watch`揭开了`watch`的神秘面纱；其实就是一个`watcher`.不过这里的`watcher`被标记为用户`watcher`,`user:true`;这里还有个逻辑就是`options.immediate=true`,这就是上述高级用法中立即执行的实现逻辑；
```js
Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
    ...
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      ...
    };
```
提到`watcher`我们很容易想到的就是进行依赖收集，形成依赖跟`watcher`相互绑定关系；那么如何进行依赖收集呢？让我们再次回到`watcher.js`中看看`Vue`对`watch`的处理.<br/>
在`watcher`初始化中，有一段处理`watch`表达式的逻辑：
```js
if (typeof expOrFn === 'function') { // 就是 render 函数
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
}
```
有前面可知`watch`传过来的`expOrFn`是一个字符串`key`值，所以会走`parsePath(expOrFn)`方法，这里利用了函数柯里化的技巧返回了一个函数；接着初始化做重要的一件事调用`this.get()`方法；这个方法就是会进行`this.getter`方法触发，如果是渲染`watcher`则进行视图更新，如果是用户`watcher`则进行取值依赖收集；然后一旦依赖的值发生了变化就会触发各个`watcher`的`update`方法;接下来的流程就跟上述响应式流程一样了。<br/>
好了，以上便是对`watch`的介绍

- 说一说Vue中的计算属性computed
1. 什么是`computed`计算属性,计算属性是基于响应式数据进行缓存的，只有响应式数据发生了变化，才会进行重新计算。这样的好处是只要依赖的响应式数据不发生变化，我们就不会多次的触发所依赖的响应式数据的`get`方法;

2. 具体的用法如下：
```js
...
let app = new Vue({
        el: '#root',
        data() {
            return {
                msg: 'hello world'
            }
        },
        computed:{
            computedMsg(){
                return this.msg+'!'
            }
        },
        created() {

        },
        methods: {
            changeMsg() {
                this.msg = 'hello world!'
            }
        }
    })
...
```

3. 实现原理
首先`Vue`初始化`initState`方法的时候进行检测时候有`computed`属性；
```js
function initState(vm){
  ...
   if (opts.computed) { initComputed(vm, opts.computed); }
  ...
}
```
在`initComputed`中做了以下几件事；1:在`Vue`实例上挂了一个`_computedWatchers`对象。2:通过遍历`computed`属性分别往`_computedWatchers`对象上添加添加计算`watcher`；并进行了计算属性的计算`defineComputed`;这里面有个小逻辑，因为我们用户手写计算属性的时候，是可以写`get`的，所以`Vue`中进行了处理；还有就是检测我们的`computed`属性是否已经存在`vm`中，然后抛出错误信息。这也是我们经常会出现的一些错误；最终得出一个小结论`computed`也是一个`watcher`;
```js
 function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }
```
既然也是一个`watcher`,那么我们还是进入`watcher.js`中看看对`computed`具体做了哪些处理；注意下在创建一个计算`watcher`的时候传入了一个`computedWatcherOptions`参数，这也是计算属性的一个关键。下面来看一下：
```js
 this.value = this.lazy // computedWatcherOptions 传入的
      ? undefined
      : this.get()
```
在计算`watcher`初始化中，并没有进行`this.get()`调用；然后我们进入`defineComputed`这个逻辑中；
```js
// 删除掉服务端渲染逻辑
function defineComputed (
    target,
    key,
    userDef
  ) {
    if (typeof userDef === 'function') {
      createComputedGetter(key)
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? createComputedGetter(key)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
```
这里的主要做了一件事就是要对每个要计算的属性进行响应式处理；然后手写了`get`和`set`方法，那么我们看下`getcreateComputedGetter`:
```js
function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }
```
这里的几个东西需要我们回忆下，`_computedWatchers`、`dirty`以及`watcher.evaluate()`;首先是`_computedWatchers`就是我们的计算属性`watcher`,我们这里根据`key`拿到之前存储的`watcher`,然后因为`dirty=true`，所以会进行一次计算，这个时候就会触发`watcher`中的`get`方法：
```js
 evaluate () {
    this.value = this.get()
    this.dirty = false
  }
```
这就会读取依赖`this.msg`,这里就会触发`msg`对计算`watcher`的收集；仅仅是收集计算`watcher`是不够的，我们肯定还要收集渲染`watcher`,于是Vue又进行了一次`watcher`收集:
```js
 if (Dep.target) {
      watcher.depend();
  }
```
为什么这样可以收集到渲染`watcher`呢？<br/>
`watcher`的`get`方法会对`watcher`进行压栈出栈的操作，如何理解呢？首先在执行`render`函数时候会对计算属性`computedMsg`(上述例子)进行读取,调用了`get`方法，执行了`pushTarget`；此时的`targetStack`为`[渲染watcher]`,然后再进行`msg`(上述例子)收集计算`watcher`又调用了`get`方法，再次进行`pushTarget`,这时候的`targetStack`应该是`[渲染watcher，计算watcher]`，执行完`get`方法后就会调用`popTarget`；此时的`targetStack`就变成了`[渲染watcher]`;这样就能很巧妙的完成了`msg`(上述例子)对渲染`watcher`收集了。<br/>
以上就是对`computed`计算属性的初始化分析，那又是如何根据依赖的变化而进行重新渲染的呢？<br/>
我们已经完成了计算属性的相关依赖的收集，所以只要依赖发生了变化就会触发`计算wacther`、`渲染watcher`的更新；那问题来了，我们如何进行重新计算呢？对的，就是改掉这个`dirty`标识；我们在`计算watcher`进行`update`时候设置这个`dirty=true`:然后执行渲染`watcher`的时候进行值的更新以及视图的更新；
```js
update () {
    /* istanbul ignore else */
    if (this.lazy) {     
      this.dirty = true
    } else if (this.sync) {   
      this.run()
    } else {
      queueWatcher(this)      
    }
  }
```
我们都知道`computed`具有缓存数据作用，主要是靠什么进行缓存的呢？<br/>
就是靠我们的`dirty`标识，`dirty`的改变是依赖于响应数据的改变的，只要响应式数据不改变我们就不会重新计算，而是返回之前的计算值；

- watch跟computed的区别<br/>

首先两者都是依赖于响应式数据的，`computed`具有缓存作用，只有依赖的数据发生改变才会进行重新计算，`watch`则只要监听数据发生了变化就会触发回调函数；`watch`更加偏向于一些异步以及复杂的逻辑处理；正如官网给出的比较demo，在计算`fullName=firstName+lastname`时候，如果使用`watch`进行侦听则比较繁琐，建议还是使用`computed`;

- `v-for` 和 `v-if`的优先级以及如何进行性能提升？
有过Vue开发经验的小伙伴都会知道，如果你的编辑器里有这样一段代码：
```html
<ul>
    <li v-for="(item,index) in 5" v-if="isExpand">
        {{item}}
    </li>
</ul>
```
这样控制台会有一个警告，官网也有给过一个说明`永远不要把 v-if 和 v-for 同时用在同一个元素上。`;那具体的原因，官网是没有给出的，我们来看一看两种编译后的代码块，对比一下就能一目了然。
1. 优先级比较
```js
if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    ...
  }
```
从这段逻辑看for的优先级是在if前面的；
2. 同时使用后的代码块：
```js
 with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_c('div', {
      staticClass: "lists"
    }, [_c('ul', _l((5), function (item, index) {
      return (isExpand) ? _c('li', [_v("\n " + _s(item) + "\n")]) :
        _e()
    }), 0)])])
  }
```
我们先忽略里面的`_c`、`_l`,`_l`逻辑就是渲染了一个列表，注意这里的逻辑是先遍历一遍然后处理`v-if`的`isExpand`三元表达式逻辑。在看一下我们另一段写发代码块；
```js
 <ul v-if="isExpand">
     <li v-for="(item,index) in 5">
          {{item}}
     </li>
</ul>
```
编译后的代码如下：
```js
 with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_c('div', {
      staticClass: "lists"
    }, [(isExpand) ? _c('ul', _l((5), function (item, index) {
      return _c('li', [_v("\n                    " + _s(item) + "\n                ")])
    }), 0) : _e()])])
  }
```
从这段逻辑可以看出，我们是先进行三元表达式的计算。当结果是true的时候就进行了列表的渲染；所以把`v-if`写在`v-for`上层能够带来一定的性能优化。




