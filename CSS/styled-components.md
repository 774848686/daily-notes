### styled-components 基本用法介绍

#### styled-components 是什么
styled-components 是一个css in js的类库；简而言之就是在js中可以写css语法；在现在的开发中我们可能会使用sass/less等进行css的预编译；sass/less的产出也是为了更方便的去使用函数、变量以及循环去处理我们的css；但我们需要结合webpack等自动构建工具进行各种loader的配置；而styled-components的出现较轻松的解决了这个问题；
1. 基本用法
```js
import styled from 'styled-components';
const Wrapper = styled.section`
  margin: 0 auto;
  width: 300px;
  text-align: center;
`;
const Button = styled.button`
  width: 100px;
  color: white;
  background: skyblue;
`;
render(
  <Wrapper>
    <Button>Hello World</Button>
  </Wrapper>
);
```
如上的案例可以看出 styled-components 就是把一些html和css的对应关系抽离成一种`组件化`,使整个html结构更容易去维护更清楚；跟react的组件化不谋而合，所以在react中很合适使用它；

2. 全局的样式
```js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}
	body {
		line-height: 1;
	}
	html, body{
		background: #f2f3f4;;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
	a{
		text-decoration: none;
		color: #fff;
	}
`;
function App() {
  return (
    <Provider>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
      </HashRouter>
    </Provider>
  )
}
```
3. 传递props
```js
// style.js
export const TestInput = styled.input`
    width:${props=>props.width};
    font-size:${props=>props.size?props.size:'14px'}
`
//  样式组件可以把属性透传到包裹的input上
    <TestInput type="password" width="100px" size="24px" placeholder="请输入密码"></TestInput>
```
4. 组件样式继承
css 中我们经常会用到多个`class`类似于`class="button active"`;styled-components可使用js继承方式达到如此效果，如下：
```js
const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const HoverButton = styled(BUtton)`
  color:red;
`
```
5. 添加属性
```js
const Input = styled.input.attrs(props => ({
  // we can define static props
  type: "password",
  // or we can define dynamic ones
  size: props.size || "1em",
}))`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  /* here we use the dynamically computed prop */
  margin: ${props => props.size};
  padding: ${props => props.size};
`;

```
6. 动画
```js
import styled, { keyframes } from 'styled-components';
    // Create the keyframes
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
// Here we create a component that will rotate everything we pass in over two seconds
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;
render(
  <Rotate>&lt; 💅 &gt;</Rotate>
);
```

