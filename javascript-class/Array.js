/******************************************************/
/*                  Array                                                           */
/*                                                                                      */
/*                                                                                      */
/*  Collection of heterogeneous data type items        */
/*  You can have duplicates                                           */
/*  It can have empty elements                                     */
/*  Arrays are mutable                                                   */
/*                                                                                      */
/******************************************************/

let x = ['a','x', 10,'sfdfkrdgkdn',20,30,4,56]

let FrontEnd = ["HTML", "CSS", "Javascript", "React", "MongoDB"]

console.log(FrontEnd[4])
console.log(FrontEnd.length)
console.log(FrontEnd[FrontEnd.length-1])
console.log(FrontEnd[50])

FrontEnd[4] = "Angular"
console.log(FrontEnd)

let str1 = "Angular"
// console.log(str1[4])

// str1[4] = "X"
// console.log(str1)

//console.log(FrontEnd.length)

//FrontEnd[80] = "VueJS"

//console.log(FrontEnd.length)



// Array Methods

//1. Fill
let arr10 = Array(5).fill("A")
let arr11 = [1,2,4,5].fill("B")


//2. Concat Method
let new_array = arr10.concat(arr11)
console.log(new_array)
console.log(arr10)

//3. indexOf Method ==> Search
console.log(FrontEnd.indexOf('VueJs'))


//4. includes Method ==> Search
console.log(FrontEnd.includes('React') )


//5. isArray Method ==> Whether it is an array or not
console.log(Array.isArray(str1))
console.log(Array.isArray(FrontEnd))


//6. Methods to convert array to String
console.log(FrontEnd.toString())
console.log(FrontEnd.join())
console.log(FrontEnd.join(''))


//6. Methods to Add Elements to Existing array
FrontEnd[FrontEnd.length] = 'VueJs'    //at the end
FrontEnd[6] = 'JQuery'                 //at particular index
FrontEnd.push('VenilaJS')             //at the end
FrontEnd.unshift('BootStrap')       //at the begining
FrontEnd.splice(2,0,1,2,3,5)          //at the particular index (1st parameter is index, 
                                                    //2nd parameter indicates how many elements to be removed
                                                    //3rd parameter onwards we can give array elements
console.log(FrontEnd)