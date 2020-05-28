### CheckBox样式修改的两种实现方法

#### 需求
在实际的项目中我们经常会用到checkbox这类表单标签，于是我们就面临修改初始样式的问题；这里总结两种修改的方法：

1. 利用`label`对checkbox 进行包装

```html
<div class="label">
<label role="checkbox">
    <span class="outer-checkbox">
        <input type="checkbox">
        <span class="inner-checkbox"></span>
    </span>
</label>
</div>
```
```css
.outer-checkbox{
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
}
.label input[type=checkbox]{
    outline: none;
    opacity: 0;
    outline: none;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
}
.label input[type=checkbox]:checked + .inner-checkbox{
    border-color: #409eff;
    background: #409eff;
}
.label input[type=checkbox]:checked + .inner-checkbox:after{
    transform: translate(-50%,-50%) scale(1);
}
.label .inner-checkbox{
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 100%;
    width: 14px;
    height: 14px;
    background-color: #fff;
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    outline: none;
}
.label .inner-checkbox:after{
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #fff;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) scale(0);
    transition: transform .15s ease-in;
}
```
2. 利用`appearance` 对checkbox所有样式进行初始化

```html
<div class="appearance">
    <input type="checkbox">
</div>
```
```css
.appearance{
    width: 14px;
    height: 14px;
}
.appearance input[type=checkbox]{
    position: relative;
    display: inline-block;
    appearance: none;
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    outline: none;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 100%;
    margin:0;
}
.appearance input[type=checkbox]:checked{
    border-color: #409eff;
    background: #409eff;
}
.appearance input[type=checkbox]:checked::after{
    transform: translate(-50%,-50%) scale(1);
}
.appearance input[type=checkbox]::after{
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #fff;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) scale(0);
    transition: transform .15s ease-in;
}
```
兼容性：IE不支持这个属性；[caniuse - appearance](https://www.caniuse.com/#search=appearance)