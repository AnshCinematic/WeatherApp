const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
app.use(express.static('public'));
app.set("view engine","ejs");

app.get('/',(req,res)=>{
    const sendData = {location :"Location" , temp : "temperature",desc:"description",feel:'Feel-Like',humidity:'humidity',speed:"speed"};
    res.render("index",{sendData:sendData});
});

app.post("/",async(req,res)=>{
    let location = await req.body.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
    const response = await fetch(url);
    const weatherdata = await response.json();
    const temp = weatherdata.main.temp;
    const desc = weatherdata.weather[0].description;
    const sendData ={};
    sendData.temp=temp;
    sendData.desc=desc;
    sendData.location=location;
    sendData.feel=weatherdata.main.feels_like;
    sendData.humidity = weatherdata.main.humidity;
    sendData.speed = weatherdata.wind.speed;
    res.render("index",{sendData:sendData});
})

app.listen(3000,()=>{
    console.log(`Server is running on ${port}`);
})