/******************************************************/
/*                  Booleans                          */
/******************************************************/


let something = []

if (something){
    console.log('Yes it is True')
}
else{
    console.log('It is False')
}

/* 
Truthy Values
    1. Any number  except 0, Whether it is +ve or -ve are truthy values
    2. Any Non-empty String
    3. Boolean with true
    4. if any Array length is not Zero

Falsy Values
    1. 0
    2. ''
    3. NaN
    4. Undefined
    5. null
    6. false

*/



//Logical Operators

let a = 10;
let b = 20;
let c = 30;


//Lets check c and Greatest

console.log(c > b && c > a)
console.log(b > c && b > a);
console.log(a > b && a > c);


let x = true
let y = false

console.log(x && y);

console.log( x || y);
console.log(x && y);

console.log(!x || !y);

//Increament/Decrement Operators

let count = 0 ;
console.log(count++);
console.log(++count);
console.log(count);
console.log(--count);
console.log(count--);



//Ternary Operators
//count > 0 ? console.log('The Num is +ve'):
