const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("Home.html", "utf-8");
const replaceVal = (tempVal , orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}" , orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}" , orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}" , orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}" , orgVal.name);
    temperature = temperature.replace("{%country%}" , orgVal.sys.country);
    temperature = temperature.replace("{%temstatus%}" , orgVal.weather[0].main);
    return temperature;
};
const server = http.createServer((req , res) =>{
    if(req.url == "/"){
        requests('http://api.openweathermap.org/data/2.5/weather?q=Patna&appid=bc0cac9d833035e2d3ccd28940dd82f1',)
.on('data', (chunk) =>{
  const objData = JSON.parse(chunk);
  const arrData = [objData];

//   console.log(arrData[0].main.temp);
   const readTimeData = arrData.map(val => replaceVal(homeFile , val))
   .join("");
   res.write(readTimeData);
// console.log(readTimeData);
})

.on('end',  (err) =>{ 
  if (err) return console.log('connection closed due to errors', err);
  res.end();
//   console.log('end');
});
    }
    
});
server.listen(8000 ,"127.0.0.1");
