let request = require('request-promise');
let movieName = "";
movieName = process.argv[2];


request("http://www.omdbapi.com/?t="+movieName+"&r=json&plot=short&apikey=trilogy")
    .then(response => {
        let data = JSON.parse(response);
        console.log(data.Title, data.Year);
    })