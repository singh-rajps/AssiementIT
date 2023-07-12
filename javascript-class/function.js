// function myFunc(){
//     console.log("Hi I just Invoked!");
//     return 100
// }

// let x = myFunc()


function add(){
    let x = 10
    let y = 20
        return "x + y"

}
let sum = add()
console.log(typeof(sum));
console.log(typeof(add));
console.log(add);



function summataion(){
    console.log(arguments.length);
    let sum = 0
    for(let v of arguments){
        sum += v
    }
    console.log("the summation is " + sum);
}

summataion(1,2,3,4,5,3,54,56,4,4);

//Annonimus functions
let x= function(){
    console.log("Hello World");
    return 10
}
console.log(x());




// function calculateGrade(marks) {
//     if (marks >= 80 && marks <= 100) {
//       return "Distinction";
//     } else if (marks >= 60 && marks < 80) {
//       return "First Class";
//     } else if (marks >= 50 && marks < 60) {
//       return "Second Class";
//     } else if (marks >= 35 && marks < 50) {
//       return "Pass";
//     } else if (marks >= 0 && marks < 35) {
//       return "FAIL";
//     } else {
//       return "Invalid marks";
//     }
//   }
  
  // Example usage:
  const studentMarks = 78;
  const grade = calculateGrade(studentMarks);
  console.log(`The student's grade is: ${grade}`);
  