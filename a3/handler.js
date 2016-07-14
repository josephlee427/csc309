var http = require('http');
var fs = require('fs');
var content = fs.readFileSync("favs.json");  
var path = require('path');
var URL = require('url');
 
var host = '127.0.0.1';
var port = 3000;


handleRequester = function (req, res) {
    url = URL.parse(req.url);
    console.log('Requesting from HTML: ' + req.url);

    if (req.url == '/') {           // Check if website exists initially
        fs.readFile('./index.html', function (error, content) {
            if (error) {
                res.writeHead(200);
                console.log(error);
                res.end('<font color="red">404! Where is index.html??</font>')
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(content, 'utf-8');
            }
        });

    } else if (req.method == 'GET') {       // Every request in this API...
        path = url.pathname.split('/');     // Splice by the '/'
        urlRequest = path[1];               // First parameter
        urlRequest2 = path[2];              // Second parameter

        if (urlRequest == 'tweets') {           // Get the tweets
            var info = JSON.parse(content);
            var tweetArray = [];

            info.forEach(function (tweet) {     // Go through every tweet and push it onto the array
                tweetArray.push(tweet.text);
            });

            res.end(JSON.stringify(tweetArray));    // Return the array

        } else if (urlRequest == 'users') {     // Get the users
            var info = JSON.parse(content); 
            var userArray = [];

            info.forEach(function (tweet) {
                if (userArray.indexOf(tweet.user.name) < 0) {       // If it's not in the list already
                    userArray.push(tweet.user.name);            
                }
            });

            res.end(JSON.stringify(userArray));

        } else if (urlRequest == 'links') {     // Get all the links
            var info = JSON.parse(content);
            var linksArray = [];

            info.forEach(function (tweet) { 
                if (linksArray.indexOf(tweet.entities.urls[0].url) < 0) {   // Check if its in the list
                    linksArray.push(tweet.entities.urls[0].url);                   // If not add
                }

                if (tweet.entities.media != undefined) {
                    if (linksArray.indexOf(tweet.entities.media[0].url) < 0) {  // Check if its in the list
                        linksArray.push(tweet.entities.media[0].url);           // If not add
                    }
                }

            });

            res.end(JSON.stringify(linksArray));

        } else if (urlRequest == 'getTweetID') {
            var info = JSON.parse(content);
            var tweetDetails = [];
            var matching;

            info.forEach(function (tweet) {
                if (urlRequest2.toString() == tweet.id_str) {   // If it matches, set it to a var
                    matching = tweet;
                }
            });

            if (matching == undefined) {       // If no matching, return nothing
                res.end(JSON.stringify([]));

            } else {
                // Add the tweet, screen name, when it was made, and timezone
                tweetDetails.push(matching.text);
                tweetDetails.push(matching.user.screen_name);
                tweetDetails.push(matching.created_at);
                tweetDetails.push(matching.user.time_zone);

                res.end(JSON.stringify(tweetDetails));
            }


        } else if (urlRequest == 'getUserByName') {
            var info = JSON.parse(content);
            var userDetails = [];
            var matching;

            info.forEach(function (tweet) {
                if (urlRequest2.toString() == tweet.user.screen_name) { // If it matches
                    matching = tweet;
                }
            });

            if (matching == undefined) {       // If no matching, return nothing
                res.end(JSON.stringify([]));

            } else {
                // Add name, screen name, location, and timezone
                userDetails.push(matching.user.name);
                userDetails.push(matching.user.screen_name);
                userDetails.push(matching.user.location);
                userDetails.push(matching.user.description);
                userDetails.push(matching.user.time_zone);
                userDetails.push(matching.user.followers_count);
                userDetails.push(matching.user.friends_count);
                userDetails.push(matching.user.favourites_count);
                userDetails.push(matching.user.statuses_count);
                userDetails.push(matching.user.created_at);



                res.end(JSON.stringify(userDetails));
            }

        } else if (urlRequest == 'getAllTweetsByUserName') {
            var info = JSON.parse(content);
            var userDetails = [];
            var matching;

            info.forEach(function (tweet) {             // Get all of their tweets
                if (urlRequest2.toString() == tweet.user.screen_name) {
                    matching = tweet;
                    userDetails.push(matching.text);
                    userDetails.push(matching.created_at);
                }
            });

            if (matching == undefined) {       // If no matching, return nothing
                res.end(JSON.stringify([]));

            } else {
                // Add name, screen name, location, and timezone
                userDetails.push(matching.user.name);
                userDetails.push(matching.user.screen_name);

                res.end(JSON.stringify(userDetails));
            }

// Self explanatory, if it's not found, display an error


        // If the server file cant be found, throw an error
        } else if (urlRequest == "handler.js"){
            fs.readFile('./handler.js', function (error, content) {     
                if (error) {
                    res.writeHead(200);
                    res.end('<h1>handler.js: 404! ITS NOT FOUND!</h1>')
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/javascript'
                    });
                    res.end(content, 'utf-8');
                }
            });

        // If the css file cant be found, throw an error
        } else if (urlRequest == "style.css"){
            fs.readFile('./style.css', function (error, content) {
                    if (error) {
                        res.writeHead(200);
                        res.end('<h1>style.css: 404! ITS NOT FOUND</h1>')
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/css'
                        });
                        res.end(content, 'utf-8');
                    }
            });

        // Otherwise its all good, return 200 code
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end("404!");
        }
    // If nothings found, return 404
    } else {
        console.log("[404] " + req.method + " to " + req.url);
        res.writeHead(404, "Page Not Found", {
            'Content-Type': 'text/html'
        });
        res.end('<html><head><title>404</title></head><body><h1>404 Page Not Found! ITS A DEAD LINK</h1></body></html>');
    }
};

http.createServer(handleRequester).listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/. Does this work?');