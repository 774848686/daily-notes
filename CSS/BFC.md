#### BFC
BFC全称是Block Formatting Context，即块格式化上下文。
`BFC`的最显著的效果就是建立一个隔离的空间，断绝空间内外元素间相互的作用。

####  创建的条件
- 根元素（<font color=red>`<html>`</font>）
- 浮动元素（<font color=red>float</font> 不为 <font color=red>none</font>）
- 绝对定位元素（<font color=red>position</font> 为 <font color=red>absolute</font> 或 <font color=red>fixed</font>）
- 表格的标题和单元格（<font color=red>display</font> 为 <font color=red>table-caption，table-cell</font>）
- 匿名表格单元格元素（<font color=red>display</font> 为<font color=red> table</font> 或 <font color=red>inline-table</font>）
- 行内块元素（<font color=red>display</font> 为 <font color=red>inline-block</font>）
- <font color=red>overflow</font> 的值不为 <font color=red>visible</font> 的元素
- 弹性元素（<font color=red>display</font> 为 <font color=red>flex</font> 或 <font color=red>inline-flex</font> 的元素的直接子元素）
- 网格元素（<font color=red>display</font> 为 <font color=red>grid</font> 或 <font color=red>inline-grid</font> 的元素的直接子元素）

#### BFC 特性
- BFC 内部的块级盒会在垂直方向上一个接一个排列
- 同一个 BFC 下的相邻块级元素可能发生外边距折叠，创建新的 BFC 可以避免的外边距折叠
- 每个元素的外边距盒（margin box）的左边与包含块边框盒（border box）的左边相接触（从右向左的格式化，则相反），即使存在浮动也是如此
- 计算 BFC 的高度时，浮动元素也会参与计算

#### 示例
- 根据特性四

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>利用bfc进行浮动的清除</title>
    <style>
        .box {
            float: left;
            width: 100px;
            height: 180px;
            margin: 10px;
            background: cyan;
        }
        .bfc {
            /* 计算 BFC 高度时，浮动元素也会参与计算，可以利用这一点清除 BFC 内部的浮动 */
            /* 尝试去掉 overflow 的注释，看效果 */
            /* overflow: auto; */
            min-height: 50px;
            background: gray;
        }
    </style>
</head>

<body>
    <div class="bfc">
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
    </div>
</body>

</html>
```
- 根据特性二

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> 同一个BFC下 两个box 间距重叠</title>
    <style>
        .box {
            width: 100px;
            height: 100px;
            background: cyan;
            /* 这里设置两个 box 的 margin，但是 margin 在垂直方向上发生了折叠，因为他们位于同一个 BFC 下 */
            margin: 100px 0;
        }
        .bfc {
            /* 为了避免外边距折叠，可以让包裹层创建新的 BFC，使两个 box 不在同一个 BFC 下 */
            /* 尝试去掉 overflow 注释，看效果 */
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div class="box"></div>
    <div class="bfc">
        <div class="box"></div>
    </div>
</body>
</html>
```
- demo4

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>demo-1</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        .left{
            background: #73DE80;    /* 绿色 */
            opacity: 0.5;
            border: 3px solid #F31264;
            width: 200px;
            height: 200px;
            float: left;
        }
        .right{                        /* 粉色 */
            background: #EF5BE2;
            opacity: 0.5;
            border: 3px solid #F31264;
            width:400px;
            min-height: 100px;
        }
        .box{
            background:#888;
            height: 100%;
            margin-left: 50px;
            /* overflow: hidden; */
        }
    </style>
</head>
<body>
    <div class='box'>
        <div class='left'> </div>
        <div class='right'> </div>
    </div>
</body>
</html>
```

- 多栏自适应布局

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>demo-2 圣杯布局</title>
    <style>
        .wrapper div {
            height: 200px;
        }
        .left {
            float: left;
            width: 200px;
            background: gray;
        }

        .right {
            float: right;
            width: 200px;
            background: gray;
        }
        .main {
            /* 中间栏创建 BFC */
            /* 由于 盒子的 margin box 的左边和包含块 border box 的左边相接触 */
            /* 同时 BFC 区域不会和浮动盒重叠，所以宽度会自适应 */
            overflow: auto;
            background: cyan;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="left"></div>
        <div class="right"></div>
        <div class="main"></div>
    </div>
</body>

</html>
```