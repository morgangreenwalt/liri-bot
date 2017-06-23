var request = require("request");
var Spotify = require('node-spotify-api');
var config = require("./config");
var Twitter = require("twitter");
var fs = require("fs");

//Link to keys
var S = new Spotify(config.spotifyKeys);
var T = new Twitter(config.twitterKeys);

// User search variables 
var searchLiri = process.argv[2];
var liriRequest = process.argv[3];

// Parameters 
var params = {
    twitterParams: {
        screen_name: 'tobyflenders0n'
    },
    
    spotifyParams: {
        type: 'track', 
        query: liriRequest
    }
}

var movieKey = "40e9cece";
var movieURL = "http://www.omdbapi.com/?t="+liriRequest+"&apikey="+movieKey+"";

//Commands

if (searchLiri === 'my-tweets') {
	T.get('statuses/user_timeline', params.twitterParams, runTwitter);
}

else if (searchLiri === 'spotify-this-song') {
	S.search(params.spotifyParams, runSpotify);
}

else if (searchLiri === 'movie-this') {
	request(movieURL, function(error, response, body){
		var searchBody = JSON.parse(body);
		var movieTitle = searchBody.Title;
		var imdbRating = searchBody.imdbRating;
		var movieYear = searchBody.Year;
		var movieCountry = searchBody.Country;
		var movieLang = searchBody.Language;
		var movieActors = searchBody.Actors;
		var movieRottenTomatoes = searchBody.Ratings[1].Value;

			if (!error && response.statusCode === 200) {
				console.log("Title: " + movieTitle);
				console.log("Rating: " + imdbRating);
				console.log("Year of Release: " + movieYear);
				console.log("Country: "+ movieCountry);
				console.log("Language: "+ movieLang);
				console.log("Actors: "+ movieActors);
				console.log("Rotten Tomatoes Rating: "+ movieRottenTomatoes);
				console.log("============================");
			}

			else {
				console.log("Something went wrong" + error);
			}
	});
}

else if (searchLiri === 'do-what-it-says') {   
	fs.readFile("random.txt", "utf8", function(error, data){

		if(error) {
		    console.log("Something went wrong" + error);
		}
		
		var results = data.slice(18);
		S.search({ type: 'track', query: results}, runSpotify);
    });    
}

//Twitter NPM
function runTwitter(error, tweets, response){
	if (!error && response.statusCode === 200) {
		for (var i = 0; i < tweets.length; i++) {
			var tweet = tweets[i].text;
			var tweetDate = tweets[i].created_at;
	      	console.log(tweet);
	      	console.log("Date Posted: "+tweetDate);
	      	console.log("============================");
		}
    }
    
    else {
      console.log("Something went wrong" + error);
    }
}

// Spotify
function runSpotify(err, data){
	if (err) {
		console.log('Error occurred: ' + err);
  	}  

	var trackName = data.tracks.items[0].name;
	var trackArtist = data.tracks.items[0].artists[0].name;
	var trackAlbum = data.tracks.items[0].album.name;
	var trackPreview = data.tracks.items[0].preview_url;

	console.log("Track Name: "+ trackName);
	console.log("Artist: "+ trackArtist);
	console.log("Album: "+ trackAlbum);
	console.log("Preview Song: "+ trackPreview);
	console.log("============================");

}

// function doWhatItSays(){
// 	fs.readFile("random.txt", "utf8", function(error, data){

// 		if(error) {
// 		    console.log(error);
// 		}
		
// 		var results = data.slice(18);
//             console.log(results);
          
//    //          S.search({ type: 'track', query: results}, function(err, data) {
                
//    //              if (err) {
//    //                  return console.log('Error occurred: ' + err);
//    //          	}

// 			// 	var trackName = data.tracks.items[0].name;
// 			// 	var trackArtist = data.tracks.items[0].artists[0].name;
// 			// 	var trackAlbum = data.tracks.items[0].album.name;
// 			// 	var trackPreview = data.tracks.items[0].preview_url;

// 			// 	console.log("Track Name: "+ trackName);
// 			// 	console.log("Artist: "+ trackArtist);
// 			// 	console.log("Album: "+ trackAlbum);
// 			// 	console.log("Preview Song: "+ trackPreview);
// 			// 	console.log("============================");
		
// 			// });
//     })    
//     runSpotify(); 
// }