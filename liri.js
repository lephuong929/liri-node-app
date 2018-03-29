require("dotenv").config();

var fs = require('fs');

// Requiring keys from keys.js
var keys = require('./keys');

// Requiring from spotify node api
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var songName = "";

var arguments = process.argv;

// Creating command for spotify-this-song
if (process.argv[2] === "spotify-this-song") {

// If no song is added after spotify-this-song
  if (arguments.length === 3) {
    spotify
      .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
      .then(function(data) {
        var spotObj1 = {
          Artist: data.album.artists[0].name,
          Track: data.name,
          Album: data.album.name,
          MP3: data.preview_url
        }

        fs.appendFile("searchHistoryLog.txt", JSON.stringify(spotObj1, null, 2), function(err) {
          if (err) {
            console.log(err);
          }
        
          else {
            console.log("searchHistoryLog.txt updated");
            console.log("Artist: " + data.album.artists[0].name);
            console.log("Track: " + data.name);
            console.log("Album: " + data.album.name);
            console.log("MP3 Preview: " + data.preview_url);
          }
        });
      })
      .catch(function(err) {
        console.error('Error occurred: ' + err); 
      });
  }
// Search for song after spotify-this-song command
  else {
    songName = arguments[3];

    for (var i = 4; i < arguments.length; i++) {
      songName = songName + " " + arguments[i];
    }

    spotify.search({type: 'track', query: songName, limit: 1}, function(err, data) {
      var spotObj2 = {
        Artist: JSON.stringify(data.tracks.items[0].artists[0].name, null, 2),
        Track: JSON.stringify(data.tracks.items[0].name, null, 2),
        Album: JSON.stringify(data.tracks.items[0].album.name, null, 2),
        MP3: JSON.stringify(data.tracks.items[0].preview_url, null, 2)
      }

      if (err) {
        return console.log('Error occurred: ' + err);
      }

      fs.appendFile("searchHistoryLog.txt", JSON.stringify(spotObj2, null, 2), function(err) {
        if (err) {
          console.log(err);
        }
      
        else {
          console.log("searchHistoryLog.txt updated");
          console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
          console.log("Track: " + JSON.stringify(data.tracks.items[0].name, null, 2));
          console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
          console.log("MP3 Preview: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2));
        }
      });
    });
  }
}
