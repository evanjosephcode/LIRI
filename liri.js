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
    break;

  case "spotify-this":
    spotifysearch();
    break;

  default:
    console.log("you have to feed LIRI a command");
}

function getExtraArguments() {
  return nodeArgs.slice(3).join("+");
}

// movie function
function movie(movieName) {
  if (!movieName) {
    movieName = getExtraArguments();
  }

  if (!movieName) {
    movieName = "mr+robot"
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      console.log("* " + data.Title);
      console.log("* " + data.Year);
      console.log("* " + data.Ratings[0].Value);
      if (data.Ratings[1]) {
        console.log("* " + data.Ratings[1].Value);
      }
      console.log("* " + data.Country);
      console.log("* " + data.Plot);
      console.log("* " + data.Actors);
    }
  });
}

// twitter function
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
    if (!error)
      for (var i = 0; i < tweets.length; i++) {
        console.log("text   :  " + tweets[i].full_text);
        console.log("created:  " + tweets[i].created_at);
      }
  });
}

// spotify function
function spotifysearch(arg) {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  songName = arg ? arg : "";

  if (songName === "") {
    songName = getExtraArguments();
  }

  // for blank inputs
  if (!process.argv[3] && songName === "") {
    songName = "Over the Hills and Far Away";
  }

  spotify.search({
    type: 'track',
    query: songName,

  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var data = data.tracks.items[0];
    console.log(data.name);
    console.log(data.artists[0].name);
    console.log(data.album.name);
    console.log(data.preview_url);
  });
}

// random function for reading txt
function random() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    var output = data.split(",");
    if (output[0] === "spotify-this-song") {
      spotifysearch(output[1]);
    } else if (output[0] === "movie-this") {
      movie(output[1]);
    } else {
      console.log("this is not a valid argument, muHAHAHAHAH");
    }
  });
}