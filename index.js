const express = require("express");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf8");
const app = express();

const kelvinToCelsius = (temp) => {
  let n = temp - 273.15;
  return n.toFixed(2);
};
const replaceVal = (tempVal, orgVal) => {
  //! here tempvalue represents the homeFile
  //* We are replaceing all the placeholder in the homeFile i.e. home.html
  //! orgVal is the arrData[0] i.e. the response from the API stored in an array

  let orgValue = tempVal.replace(
    "{%tempVal%}",
    kelvinToCelsius(orgVal.main.temp)
  );

  orgValue = orgValue.replace("{%location%}", orgVal.name);

  orgValue = orgValue.replace(
    "{%tempMinVal%}",
    kelvinToCelsius(orgVal.main.temp_min)
  );

  orgValue = orgValue.replace(
    "{%tempMaxVal%}",
    kelvinToCelsius(orgVal.main.temp_max)
  );

  orgValue = orgValue.replace("{%country%}", orgVal.sys.country);

  orgValue = orgValue.replace("{%weatherStatus%}", orgVal.weather[0].main);

  return orgValue;
};
app.get("/", (req, res) => {
  res.redirect("home");
});

app.get("/home", (req, res) => {
  requests(
    "https://api.openweathermap.org/data/2.5/weather?q=Switzerland&appid=728bb9c50b7057f41dd2db7e6084b4f5"
  )
    .on("data", (chunk) => {
      let chunkObj = JSON.parse(chunk);
      let arrData = [chunkObj];
      //console.log(arrData);
      //console.log(arrData[0].main.temp);
      const realTimeData = arrData.map((eachVal) =>
        replaceVal(homeFile, eachVal)
      );

      //console.log(realTimeData);
      res.send(`${realTimeData}`);
    })
    .on("end", (err) => {
      if (err) return console.log("connection closed due to errors", err);

      console.log("end");
    });

  //res.send(`${homeFile}`);
});
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
