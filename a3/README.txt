Instructional README

To start:

> Navigate to the folder in command prompt
> type in node handler.js
> Open browser and go to 127.0.0.1:3000 or localhost:3000

REST API:

Domain: tweets, users, links getTweetID, getUserByName, getAllTweetsByUserName

Core Functions: They are all GET

GET exampels:

GET http://localhost:3000/tweets -> returns the whole database of all of the tweets

GET http://localhost:3000/users -> returns the whole database of all the users

GET http://localhost:3000/links -> returns all of the links mentioned in all of the tweets

GET http://localhost:3000/getTweetID -> returns a detailed list of a tweet given a tweet_ID

GET http://localhost:3000/getUserByName -> returns a detailed list of a user given the username

GET http://localhost:3000/getAllTweetsByUserName -> returns all of the tweets made by a user, given the username