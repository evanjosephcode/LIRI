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
    spotifysearch(process.argv[3]);
    break;

  default:
    console.log("you have to feed LIRI a command");
}


// movie function
function movie(movieName) {
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
function spotifysearch(songName) {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  spotify.search({
    type: 'track',
    query: songName,

  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    // else if (process.argv[3] === "") {
    //   songName = "The Sign";
    // }

    else {
    console.log(JSON.stringify(data.tracks.items[0].name));
    console.log(JSON.stringify(data.tracks.items[0].artists[0].name));
    console.log(JSON.stringify(data.tracks.items[0].album.name));
    console.log(JSON.stringify(data.tracks.items[0].preview_url));
    }
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
      console.log("this is not a valid command in your random file as the argument");
    }
  });
}