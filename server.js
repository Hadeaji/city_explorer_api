// statics
let express = require('express');
let cors = require('cors')

let app = express();
app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT;
//


// first request
    app.get('/location',handelLocation)


    function handelLocation(req,res){

        try{
            let city = req.query.city;
            let jsonData = require('./data/location.json');
            let jsonObject = jsonData[0];
            let locationObject = new Location(city, jsonObject.display_name, jsonObject.lat, jsonObject.lon);
            res.status(200).json(locationObject);
        }catch(error){
            res.status(500).send('Sorry, something went wrong');
        }
        
    }

    function Location(search_query,formatted_query,latitude,longitude){
        this.search_query = search_query;
        this.formatted_query = formatted_query;
        this.latitude = latitude;
        this.longitude = longitude;

    }


//

// second request
app.get('/weather',handelWeather)


function Weather(forcast,time){
    this.forcast = forcast;
    this.time = time; 
}

function handelWeather(req,res){

    try{
        let city = req.query.city;
        let jsonData = require('./data/weather.json');
        let jsonObject = jsonData.data;
        let result=[];

        jsonObject.forEach(element => {
            let forcast = element.weather.description;
            let time = taskDate(Date.parse(element.datetime));

            let cityWeather = new Weather(forcast,time);
            result.push(cityWeather);
        });

        res.status(200).json(result);

    }catch(error){
        res.status(500).send('Sorry, something went wrong');
    }
    
}


function taskDate(dateMilli) {
    var d = (new Date(dateMilli) + '').split(' '); 
    return [d[0], d[1], d[2], d[3]].join(' ');
}


//

app.listen(PORT, ()=> {
    console.log(`The App Port is ${PORT}`);

});
