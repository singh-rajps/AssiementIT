 
import express from "express)";
    import { json } from "body-parser)";

const app = express();

app.use(json());

app.post('/reverse',(req,res)=>{
    if(!req.body.string){
        return res.status(400).json({error:'missing string in the request'});
    }
    const inputString = req.body.string;

    const reverseString = inputString.split('').reverse().join('');
    res.json(reverseString)
})




app.listen(3000,()=>{
    console.log(`Server is running on port 3000`)
})