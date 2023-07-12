
// Array.prototype.concat(): Combines two or more arrays and returns a new array.
// const arr1 = [1, 2, 3];
// const arr2 = [4, 5, 6];
// const newArr = arr1.concat(arr2);
// console.log(newArr); // [1, 2, 3, 4, 5, 6]


//Array push() :- Adds one or more elements to the end of an array and returns

// let arr = [1,2,3];
// arr.push(4);
// console.log(arr);


//Array pop():- Removes the last element from an array and returs that element.


// const arr3 = [1,2,3,4,5];
// const removedElement = arr3.pop();
// console.log(removedElement);
// console.log(arr3);

// //array shift() remove the first element from an array
// const removedElement1 = arr3.shift();
// console.log(arr3);

// //unshift();--Adds one or more elements to the first of an array
// arr3.unshift(6);
// console.log(arr3);


//splice():- Change the Contents of an array by removing ,replacing or adding elements

// const arr4 = [1, 2, 3, 4, 5];
// const removedElements = arr.splice(2, 2, 6, 7);
// console.log(arr4); // [1, 2, 6, 7, 5]
// console.log(removedElements); // [3, 4]


// const arr5 = ['hi','low','ahhh'];
// arr5.reverse();
// console.log(arr5);

// const reversed = [...arr5].reverse();


//
// const original = [7, 10];
// const spliced = original.toSpliced(1, 0, 8, 9);

// console.log(original); // [ 7, 10 ]
// console.log(spliced); // [ 7, 8, 9, 10 ]


// let Array1 = [1,2,3,5,6,7]
// let Array2 = [3,5,23,35,3,6];

// let all_Array = Array1.concat(Array2)
// console.log(all_Array);

// let all_new_array = [...Array1,...Array2]
// console.log(all_new_array);

// let x = [1,2,4,5]
// sqr = [ ]
// let y = x.forEach(el => sqr.unshift(el**2))

//     console.log(x);


//MAP create like if you want to same thing but it will modify the element
//it is create new array

// let x = [1,2,4,5]
// let y = x. map(el =>el**2)
// console.log(y);


// let y2 = x.map(function(){
//     console.log('map==>',y2);
// })


// let names = ['Ravindra Jadeja',
//     'Axar Patel',
//     'Ajinkya Rahane',
//    ' Shardul Thakur']

//    let y3 = names.map(name=>name.toUpperCase())
//    console.log('Map==>' ,y3);

//prime numbers
   let numbers = [2,3,4,5,6,7,43,5,4,54,5]
let y4 = numbers.filter(el=>el>=el>=18)
console.log(numbers);



