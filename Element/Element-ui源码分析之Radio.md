### Element-ui Radio 组件的实现
> 我们在实际开发中经常会用到`Radio`组件，这个组件呢用法跟实现上也比较简单，但是去剖开`Element-UI`的源码来看，里面还是有一些比较好的细节值得学习。
- 思考一下几个问题
我们思考以下几个问题：第一，为什么我们可以直接在自定义组件上使用`v-model`？第二，我们使用`<el-radio-group>`时候是如何进行跨组件传递参数的？
- `<el-radio>`的实现
`radio`组件核心就是使用原生`label`、`input`标签实现，然后根据不同css`class`进行不同状态的展示。具体的`html`如下：

```html
<label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="el-radio__inner"></span>
      <input
        ref="radio"
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="mdel"
        @focus="focous = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="el-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
```
我们可以看到根据不同的`class`名我们就能展示对应样式。`aria-checked`、`aria-disabled`这些是html5新增的一些属性为了给读屏软件读取内容的，`tabindex`规定元素的 tab 键控制次序，方便键盘操作。我们都知道`radio`组件的使用方式是：
```vue
<template>
  <el-radio v-model="radio" label="1">备选项</el-radio>
  <el-radio v-model="radio" label="2">备选项</el-radio>
</template>

<script>
  export default {
    data () {
      return {
        radio: '1'
      };
    }
  }
</script>
```
那么如何知道当前`radio`选择的是哪个呢？我们只需要判断`radio`的值跟传入的`label`相同即可，在源码中的响应逻辑是：
```js
...
 model: {
    get() {
      return this.isGroup ? this._radioGroup.value : this.value;
    },
    set(val) {
      if (this.isGroup) {
        this.dispatch('ElRadioGroup', 'input', [val]);
      } else {
        this.$emit('input', val);
      }
      this.$refs.radio && (this.$refs.radio.checked = this.model === this.label);
    }
}
...
```
那么`<el-radio></el-radio>`是如何监听到这个变化的值呢？我们看到组件里派发了一个事件` this.$emit('input', val);`，这样就能够同步这个改变的值了。那为什么能这样写就可以了呢？
这就是`v-model`的实现逻辑了，实际上它等价于以下的代码:
```html
<template>
  <el-radio :value="radio" @input="changeValue" label="1">备选项</el-radio>
  <el-radio :value="radio" @input="changeValue" label="2">备选项</el-radio>
</template>

<script>
  export default {
    data () {
      return {
        radio: '1'
      };
    },
    methods:{
       changeValue(val){
           this.radio = val;
       }
    }
  }
</script>
```
所以`v-model`其实就是以上的一个语法糖，派发一个`input`事件这样我们就能够在自定义组件上使用`v-model`了。好了第一个问题我们就能解决了。

- `<el-radio-group>`的实现
这个组件其实就是`radio`组件的一个扩展，使用方法如下：
```html
<template>
  <el-radio-group v-model="radio">
    <el-radio :label="3">备选项</el-radio>
    <el-radio :label="6">备选项</el-radio>
    <el-radio :label="9">备选项</el-radio>
  </el-radio-group>
</template>

<script>
  export default {
    data () {
      return {
        radio: 3
      };
    }
  }
</script>
```
在`Element-UI`源码中逻辑都是写在了`radio`组件中，首先我们要判断这个是不是单选框组组件，在`computed`中有以下的逻辑：
```js
 isGroup() {
    let parent = this.$parent;
    while (parent) {
      if (parent.$options.componentName !== 'ElRadioGroup') {
        parent = parent.$parent;
      } else {
        this._radioGroup = parent;
        return true;
      }
    }
    return false;
}
```
循环往上查找父组件，看是否有组件名为`ElRadioGroup`,有则是单选框组。这个时候初始化的时候。`model`的值就会取`_this._radioGroup.value`。那么选择子组件后的值如何同步到父组件中呢？我们注意到`model`改变的时候有个这段逻辑：
```js
if (this.isGroup) {
    this.dispatch('ElRadioGroup', 'input', [val]);
  } else {
    this.$emit('input', val);
  }
}
```
那么我们就来看一下这个`dispatch`方法。这个方法是写在了`mixins`中代码如下：
```js
dispatch(componentName, eventName, params) {
    var parent = this.$parent || this.$root;
    var name = parent.$options.componentName;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
        name = parent.$options.componentName;
      }
    }
    if (parent) {
      parent.$emit.apply(parent, [eventName].concat(params));
    }
}
```
这段的逻辑就是查找到目标父组件然后执行派发`input`方法，为什么要进行循环呢？因为我们可能会存在多级父组件，比如：
```html
 <el-radio-group v-model="radio">
   <div>
        <el-radio :label="3">备选项</el-radio>
        <el-radio :label="6">备选项</el-radio>
        <el-radio :label="9">备选项</el-radio>
   </div>
  </el-radio-group>
```
派发后就能够更新绑定的`radio`值了。我们看`el-radio-group`还有个`change`事件，根据以上的学习就变得很简单,代码如下：

```js
handleChange() {
  this.$nextTick(() => {
    this.$emit('change', this.model);
    this.isGroup && this.dispatch('ElRadioGroup', 'handleChange', this.model);
  });
}
```
好了，以上的两个问题就解决了，这就是他们的真实面纱，期待我们揭开更多的不为人知的面纱。

