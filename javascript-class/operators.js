//console.log( 1 / 0 ); // Infinity

//console.log( "not a number" / 2 ); // NaN, such division is erroneous

console.log( "not a number" / 2 + 5 ); // NaN


let str = "Hello";
let str2 = 'Welcome to ITDefine!';
let phrase = `${str} dear friend`;
let name = "pushpraj";
console.log(str);
console.log(str2);
console.log(phrase);
console.log( `Welcome to ${name}!` )

//Boolean
let isSmaller = 5 < 3;
console.log( isSmaller );


//undefined
let x;
console.log(x);//"undefined

let y = 123;
y = undefined;
console.log(y);//it is possible to assign undefined to any variable


let symbol1 = Symbol("symbol")
let symbol2 = Symbol("symbol")
console.log(symbol1 === symbol2) // returns "false"


//&& Operators
let hour = 11;
if (hour > 10 && hour < 18) {
  console.log('We are open!');
}