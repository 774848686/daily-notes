#### 安装

```ssh
npm install typescript -g
tsc hello.ts
```

#### 数据类型

- 布尔类型

```js
let a:boolean = false
```
- 字符串

```js
let a:string = 'hello world'
```
- 数字类型

```js
let a:number = 10086;
```
- 数组类型

```js
let a:number[]=[1,2];
let b:Array<number>=[1,2];
```
- 元祖类型

```js
let a:[number,string] = [1,'hello'];
```
- 枚举类型

```js
 enum Flag{
     success,
     fail
 }
 let a:Flag = Flag.success; //0 如果不指定=，则表示取索引；
 
 enum Flag{
     success=200,
     fail=100
 }
 let a:Flag = Flag.success; //200
```
- 任意类型

```js
let $body:any = document.body;
```
- undefined | null

```js
let a:undefined | null;
```
- void 无返回类型

```js
function run():void{
    console.log('void')
}
```
- newer 包含undefined、null 表示从不出现的类型

```js
let b:never;
b = (()=>{
    throw new Error('never')
})()
```
#### 函数定义
- 返回值以及参数类型

```js
function run (a:number,b:number):number{
    return a+b;
}
```
- 没有返回值

```js
function run (a:number,b:number):void {
    console.log(a+b);
}
```
- 可选参数 <可选参数要放在后面>

```js
function getInfo (name:string,age?:number):string {
    if(age){
        return `${name}----${age}`
    }else{
        return name;
    }
}
```
- 默认参数

```js
function getInfo (name:string,age:number=20):string {
    if(age){
        return `${name}----${age}`
    }else{
        return name;
    }
}
```
- 取部分参数<...>

```js
function sum (a:number,...rest:number[]):number {
    return rest.reduce((pre,cur)=>{
        return pre+cur;
    },a)
 }
 console.log(sum(1,2,3,4))
```
#### 函数重载
```js
// 重载
function padding(all: number);
function padding(topAndBottom: number, leftAndRight: number);
function padding(top: number, right: number, bottom: number, left: number);
// Actual implementation that is a true representation of all the cases the function body needs to handle
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}
```
#### 类的定义
- 类里的属性和方法如何定义

```js
class Person {
    name: string;
    constructor(name: string) {
        this.name = name
    }
    getName(): string {
        return this.name;
    }
    setName(name: string): void {
        this.name = name;
    }
}
const p = new Person('devin');
console.log(p.getName())
```
- 类的继承 extends、super <同名方法会被覆盖>

```js
class Person {
    name: string;
    constructor(name: string) {
        this.name = name
    }
    getName(): string {
        return this.name;
    }
    setName(name: string): void {
        this.name = name;
    }
}

class SubPerson extends Person {
    constructor(name: string) {
        super(name)
    }
    work():string{
        return `${this.name}在工作`
    }
}
const p = new SubPerson('devin');
console.log(p.work())
```
- 类里面的修饰符
1. public :公有 在该类里面、子类以及外面都能够访问<默认修饰符>
2. protected :保护类型 在该类里面以及子类可使用
3. private :私有 只能在该类中使用

```js
class Person {
    protected name: string;
    constructor(name: string) {
        this.name = name
    }
    getName(): string {
        return this.name;
    }
    setName(name: string): void {
        this.name = name;
    }
}
class SubPerson extends Person {
    constructor(name: string) {
        super(name)
    }
    work():string{
        return `${this.name}在工作`
    }
}
const p = new Person('张三');
const s = new SubPerson('devin')
console.log(p.name) // 外部不可访问
```

```js
class Person {
    private name: string;
    constructor(name: string) {
        this.name = name
    }
    getName(): string {
        return this.name;
    }
    setName(name: string): void {
        this.name = name;
    }
}
class SubPerson extends Person {
    constructor(name: string) {
        super(name)
    }
    work():string{
        return `${this.name}在工作`
    }
}
const p = new Person('张三');
const s = new SubPerson('devin')
console.log(p.name) //私有不可在外访问
console.log(s.work()) // 子类不可访问
```
- 静态属性和方法

```js
class Person {
    private name: string;
    static age:number=20;
    constructor(name: string) {
        this.name = name
    }
    static getName(name:string):string{
        return `我的名字是${name}`
    }
    static print():void{
        console.log(this.getName('devin'))
    }
}
Person.print();
```
- 多态 <父类定义一个方法不去实现，让子类去实现；每个实现方法各不相同>

```js
class Animal{
    public name:string;
    constructor(name:string){
        this.name = name;
    }
    eat():void{

    }
}
class Dog extends Animal{
    constructor(name:string){
        super(name)
    }
    eat():string{
        return `${this.name}吃骨头`;
    }
}
class Cat extends Animal{
    constructor(name:string){
        super(name)
    }
    eat():string{
        return `${this.name}吃鱼`;
    }
}
const dog = new Dog('狗狗');
const cat = new Cat('猫咪');
console.log(dog.eat())
console.log(cat.eat())
```
- abstract 抽象类 <抽象类和抽象方法用来定义标准，子类中必须满足这个抽象类的标准。比如Animal抽象类中定义了eat方法，那么他的子类就必须有这个方法存在> ==注意：抽象类是无法进行实例话的；==

```js
abstract class Animal{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    abstract eat():any;
}
class Cat extends Animal{
    constructor(name:string){
        super(name)
    }
    eat():string{
        return `${this.name}吃鱼`;
    }
}
class Dog extends Animal{
    constructor(name:string){
        super(name)
    }
    run():string{
        return `${this.name}吃骨头`; //非抽象类“Dog”不会实现继承自“Animal”类的抽象成员“eat”。
    }
}
const dog = new Dog('狗狗');
const cat = new Cat('猫咪');
console.log(dog.run())
console.log(cat.eat())
```

#### TypeScript中的接口
- 定义 <br>
就是对属性函数以及类的一些规范;
- `interface`属性接口 <对json的一些约束>

```js
interface fullName {
    firstName?: string;//可选可不选
    lastName: string;
}
function getFullName(name: fullName): string {
    return `我的全名是${name.firstName}${name.lastName}`;
}
const info = {
    firstName:'张',
    lastName:'三'
};
console.log(getFullName(info));

```
- 函数类型接口 <对参数以及返回值进行约束>

```js
interface scriptStand {
    (key: string, value: string): string;
}
const strMade: scriptStand = function (key: string, value: string): string {
    return `${key}---devin---${value}`
}
console.log(strMade('zdf','zejier'))
```
也可改成这样
```js
interface scriptStand {
    (key: string, value: string): string;
}
const strMade: scriptStand = function (a: string, b: string) {
    return `${a}---devin---${b}`
}
console.log(strMade('zdf','zejier'))
```
- 可索引接口 <对数组以及对象进行约束>

```js
interface userArr {
    [index: number]: string;
}
const arr: userArr = ['111', '2222']; 

interface userObj {
    [index: string]: string;
}
const obj: userObj = {
    name:'devin',
    age:'20'
}; 
```
- 类类型接口 <对类进行约束> 和抽象类相似

```js
interface Animal {
    name: string;
    eat(str: string): void
}
class Dog implements Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    eat(str: string): string {
        return `${this.name}吃${str}`;
    }
}
const dog = new Dog('狗狗');
console.log(dog.eat('骨头'))
```
- 接口的扩展 <可继承>

```js
interface Animal {
    name: string;
    eat(str: string): void
}
interface Monkey extends Animal {
    work(): void;
}
class Cat implements Monkey {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    eat(str: string): string {
        return `${this.name}吃${str}`;
    }
    work() {
        console.log(`${this.name}会砸石头哦!`)
    }
}
const cat = new Cat('小花猫');
console.log(cat.eat('🐟'));
cat.work();
```
```js
interface Animal {
    name: string;
    eat(str: string): void
}
interface Monkey extends Animal {
    work(): void;
}
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    run(): void {
        console.log(`${this.name}说：我会奔跑哦～`)
    }
}
class Cat extends Animal implements Monkey {
    constructor(name: string) {
        super(name);
    }
    eat(str: string): string {
        return `${this.name}吃${str}`;
    }
    work() {
        console.log(`${this.name}会砸石头哦!`)
    }
}
const cat = new Cat('小花猫');
cat.run()
```
##### 泛型
- 定义<br/>
解决类、接口、方法的复用性以及不特定数据类型的支持;
- 泛型函数

```js
function getData<T>(value: T): T {
    return value;
}
console.log(getData<number>(122))
console.log(getData<string>('122'))
```
- 泛型类

```js
class MinMatch<T>{
    public list:Array<T>=[];
    add(value:T){
        this.list.push(value);
    }
    min():T{
        let minResult = this.list[0];
        for(let i = 0;i<this.list.length;i++){
            if(minResult>this.list[i]){
                minResult = this.list[i];
            }
        }
        return minResult;
    }
}
const minNumber = new MinMatch<number>();
minNumber.add(2);
minNumber.add(22);
minNumber.add(13);
minNumber.add(9);
console.log(minNumber.min())

const minString = new MinMatch<string>();
minString.add('q');
minString.add('i');
minString.add('b');
minString.add('v');
console.log(minString.min())
```
- 泛型接口

1. 第一种写法

```js
interface conf{
    <T>(value:T):T;
}
const getValue:conf = function <T>(value:T){
    return value;
}
console.log(getValue<string>('ass'))
console.log(getValue<number>(123))
```
2. 第二种写法

```js
function getValue2<T>(value:T){
    return value;
}
const getV:conf2<string> = getValue2;
console.log(getV('111'))
```

