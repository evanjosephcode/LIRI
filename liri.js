require('dotenv').config();
var request = require("request");
var keys = require("./keys");
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
    // random();
    console.log("do what it says action");
    break;

  case "placeholder":
    // placeholder();
    console.log("placeholder stuffs");
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
      for (var i = 0; i < tweets.length; i++ ) {
      // console.log(tweets);
      // console.log(tweets[i].created_at);
      console.log("text   :  " + tweets[i].full_text);
      console.log("created:  " + tweets[i].created_at);
    }
  });
}