### Element-ui Layout布局 Row、Col组件的实现
> 我们在实际开发中遇到一些布局的时候会用到`Layout`布局，这个布局只要配置一些参数就能够达到很好的布局效果甚至可以响应式，那里面的具体是怎么实现的呢，让我们去剖开`Element-UI`的源码，学习里面的一些细节吧。
##### 基本说明以及用法
`Element-UI`的Layout布局是通过基础的<Font color=red>24</Font>分栏，迅速简便地创建布局。根据不同的组合，很快的就能够生成一个很美观的响应式布局。具体的用法如下：
```html
<el-row>
  <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
</el-row>
```
由上述的示例代码可以看出`Row`组件主要是创建每行分栏的布局方式，比如之间的一些间隔、对齐方式等。而`Col`则创建每个分栏，分栏的长度、偏移量等。我们可以进行自由组合每个分栏，从而达到一种响应式效果。
##### Row组件的分析
- render函数
我们都知道`vue`除了可以使用`template`模板编写组件外，有时候我们还可以直接使用`render`函数去编写一个组件。因为`template`模板最终也是编译成了`render`函数。<br/>
为什么会有`render`函数的写法？比如现在有个需求：根据动态的<font color=red>level</font>生成从h1-h6字体大小的标题的时候，我们如果使用`template`去实现的话我们页面中可能会出现很多类似这样的伪代码：
```html
<template>
   <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</template>
```
但是如果是使用`render`函数则是比较简单：
```js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```
这里还有一个代码优化点是。`this.$slots.default`存储的就是插槽内容，不需要写那么多遍<slot></slot>。
- 源码分析
`Row`组件的源码比较简单，因为我们可以通过`tag`这个`prop`对其指定一个渲染标签,所以组件是直接使用`render`渲染函数进行编写。 `render`函数部分如下：
```js
render(h) {
    return h(this.tag, {
      class: [
        'el-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : '',
        { 'el-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default);
  }
```
如上的源码可以得出Row主要是控制`class`名来进行控制内容布局的。这里有`gutter`属性能够控制行内列的间隔数。如果说我们设置为`gutter=20`,那么每个列项都进行左右间距`10px`，那么就会出现个问题：第一个列项跟最后一个列项会出现左右的间距。那该如何让第一个跟最后一个左右间隔去掉这个`10px`呢？`Row`的处理方案是这个行左右各偏`-10px`,所以用了一个计算属性来设置样式：
```js
computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }
      return ret;
    }
  },
```
##### Col组件的分析
- 组件分析
`Col`主要是为了设置每一列的长度以及偏移量。主要的属性是`span`、`offset`；同样这个组件也是采用`render`函数去编写，首先我们看如何通过`span`、`offset`去控制列的，源码如下：
```js
render(h) {
    let classList = [];
    let style = {};
    ...

    ['span', 'offset', 'pull', 'push'].forEach(prop => {
      if (this[prop] || this[prop] === 0) {
        classList.push(
          prop !== 'span'
            ? `el-col-${prop}-${this[prop]}`
            : `el-col-${this[prop]}`
        );
      }
    });

    ...

    return h(this.tag, {
      class: ['el-col', classList],
      style
    }, this.$slots.default);
  }
```
从这可以看出，`col`的列宽是通过不同`class`名去做控制的。我们找到对应的`.scss`文件，发现他使用了`sass`@for循环语句去计算不同格子的宽度：
```scss
@for $i from 0 through 24 {
  .el-col-#{$i} {
    width: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-offset-#{$i} {
    margin-left: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-pull-#{$i} {
    position: relative;
    right: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-push-#{$i} {
    position: relative;
    left: (1 / 24 * $i * 100) * 1%;
  }
}
```
同理`offset`也是使用相同的逻辑。这样我们就可以根据不同的`span`、跟`offset`混合组合不同风布局了，是不是感觉背后的逻辑是如此的简单呢。我们再思考一个问题就是如果我们要控制一组相同的列宽间隔，需要一个个的去做设置么？答案是不用的，我们可以借助上述的`Row`组件中的`gutter`属性去做统一设置。那怎么实现的呢？源码如下：
```js
 computed: {
    gutter() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== 'ElRow') {
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    }
  }
```
我们通过往上遍历父组件，如果父组件的组件名为`ElRow`,则取到`gutter`值，然后让组件左右内边距设置对应的值就好了:
```js
if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }
```
这样我们就解决了统一列宽设置的问题；
- 响应式布局
这里我们用到了css3中的媒体查询来进行响应式布局，相应尺寸分别是`xs`、`sm`、`md`、`lg` 和 `xl`。使用代码如下：
```html
<el-row :gutter="10">
  <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple"></div></el-col>
  <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="grid-content bg-purple-light"></div></el-col>
  <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="grid-content bg-purple"></div></el-col>
  <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple-light"></div></el-col>
</el-row>
```
<strong>说明：`xs`:<768px 响应式栅格数或者栅格属性对象,`sm`:≥768px 响应式栅格数或者栅格属性对象,`md`:≥992px 响应式栅格数或者栅格属性对象,`lg`:≥1200px 响应式栅格数或者栅格属性对象,`xl`:≥1920px 响应式栅格数或者栅格属性对象.</strong><br>
背后的逻辑就是不同屏幕尺寸所展示的格子数是不一样的，而且是根据屏幕宽度进行响应式。首先，我们看是如何进行不同的`class`绑定的：

```js
['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      if (typeof this[size] === 'number') {
        classList.push(`el-col-${size}-${this[size]}`);
      } else if (typeof this[size] === 'object') {
        let props = this[size];
        Object.keys(props).forEach(prop => {
          classList.push(
            prop !== 'span'
              ? `el-col-${size}-${prop}-${props[prop]}`
              : `el-col-${size}-${props[prop]}`
          );
        });
      }
    });
```
这里面`xs`等属性也是可以使用对象。所以会有个处理对象的逻辑；以上的js处理的逻辑比较简单，我们再看一下css是怎么处理这个媒体查询的逻辑的。<br>
在分析css的时候，我们先了解一个概念，那就是`sass`中的内置方法`map-get`。`map-get($map,$key)`函数的作用就是可以通过`$key`取到对应的`value`值，可以理解为就是一个映射关系。如果不存在则不会编译对应的css。举个🌰：
```scss
$social-colors: (
    dribble: #ea4c89,
    facebook: #3b5998,
    github: #171515,
    google: #db4437,
    twitter: #55acee
);
.btn-dribble{
  color: map-get($social-colors,facebook);
}
// 编译后
.btn-dribble {
  color: #3b5998;
}
```
第二个是sass内置方法`inspect(value)`,这个方法就是一个返回一个字符串的表示形式，`value`是一个sass表达式。举个🌰：
```scss
$--sm: 768px !default;
$--md: 992px !default;
$--lg: 1200px !default;
$--xl: 1920px !default;

$--breakpoints: (
  'xs' : (max-width: $--sm - 1),
  'sm' : (min-width: $--sm),
  'md' : (min-width: $--md),
  'lg' : (min-width: $--lg),
  'xl' : (min-width: $--xl)
);
@mixin res($breakpoint){
  $query:map-get($--breakpoints,$breakpoint)
  @if not $query {
    @error 'No value found for `#{$breakpoint}`. Please make sure it is 
    defined in `$breakpoints` map.';
  }
  @media #{inspect($query)}
   {
    @content;
   }
}
.element {
  color: #000;
 
  @include res(sm) {
    color: #333;
  }
}
// 编译后的css

.element {
  color: #000;
}
@media (min-width: 768px) {
  .element {
    color: #333;
  }
}
```
好了，我相信聪明的你已经很好的掌握了这两个方法，那我们去看一下`element`是怎么去实现的吧。<br>
其实上述的第二个例子已经道出一二,我们看一下源码：
```scss
$--sm: 768px !default;
$--md: 992px !default;
$--lg: 1200px !default;
$--xl: 1920px !default;

$--breakpoints: (
  'xs' : (max-width: $--sm - 1),
  'sm' : (min-width: $--sm),
  'md' : (min-width: $--md),
  'lg' : (min-width: $--lg),
  'xl' : (min-width: $--xl)
);
/* Break-points
 -------------------------- */
@mixin res($key, $map: $--breakpoints) {
  // 循环断点Map，如果存在则返回
  @if map-has-key($map, $key) {
    @media only screen and #{inspect(map-get($map, $key))} {
      @content;
    }
  } @else {
    @warn "Undefeined points: `#{$map}`";
  }
}
@include res(xs) {
  @for $i from 0 through 24 {
    .el-col-xs-#{$i} {
      width: (1 / 24 * $i * 100) * 1%;
    }

    .el-col-xs-offset-#{$i} {
      margin-left: (1 / 24 * $i * 100) * 1%;
    }
  }
}
@include res(sm) {
  ...
}
@include res(md) {
  ...
}
@include res(lg) {
  ...
}
@include res(xl) {
  ...
}
```
这样我们就会在不同的屏幕尺寸下进行不同的长度以及间隔的展示了，这样去写我们的媒体查询是不是很棒呢？
<br>
好了，本次揭晓了element的栅格布局的面纱，期待我们揭开更多的不为人知的面纱。
