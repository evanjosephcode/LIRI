require('dotenv').config();
var request = require("request");
var fs = require("fs");
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');


var nodeArgs = process.argv;

var action = process.argv[2];

switch (action) {
  case "my-tweets":
    tweets();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    random();
    console.log("do what it says action");
    break;

  case "spotify-this":
    spotifysearch();
    break;

  default:
    console.log("you have to feed LIRI a command");
}


// movie function
function movie() {
  var movieName = "";

  if (nodeArgs.length < 4) {
    movieName = "mr+nobody";
  } else {
    if (nodeArgs.length > 4) {
      for (var i = 3; i < nodeArgs.length; i++) {
        movieName = movieName + "+" + nodeArgs[i];
      }
    } else {
      movieName = nodeArgs[3];
    }
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log("* " + JSON.parse(body).Title);
      console.log("* " + JSON.parse(body).Year);
      console.log("* " + JSON.parse(body).Ratings[0].Value);
      console.log("* " + JSON.parse(body).Ratings[1].Value);
      console.log("* " + JSON.parse(body).Country);
      console.log("* " + JSON.parse(body).Plot);
      console.log("* " + JSON.parse(body).Actors);
    }
  });
}

// Function for Twitter
function tweets() {
  var client = new Twitter(keys.twitter);

  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var params = {
    screen_name: 'evanjosephcode',
    count: 20,
    tweet_mode: 'extended'
  };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    // var counter = tweets.length;
    if (!error)
      for (var i = 0; i < tweets.length; i++) {
        // console.log(tweets);
        // console.log(tweets[i].created_at);
        console.log("text   :  " + tweets[i].full_text);
        console.log("created:  " + tweets[i].created_at);
      }
  });
}

function spotifysearch() {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  spotify.search({
    type: 'track',
    query: 'All the Small Things'
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    // console.log(JSON.stringify(tracks.items[0].album.available_markets[1].data)); 
    console.log(data);
  });

function random() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
  
    // Break the string down by comma separation and store the contents into the output array.
    var output = data.split(",");
  
    // Loop Through the newly created output array
    for (var i = 1; i < output.length; i++) {
  
      // Print each element (item) of the array/
      // console.log(output[i]);
      // output[0] = process.argv[2];
      output[1] = output[i];
      output[1] = query;
      spotifysearch(query);


    }
  });
}

};