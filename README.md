## Playstation Library

### Description
A RESTful API to keep track of your Playstation game library, using a MERN stack. 
### How to run

##### Requirements
- [Node](https://nodejs.org/en/download/)
- For the app to work you will need to replace the AWS bucket details in App.js to your own.
- You will also need to change the Mongodb route in server.js.
##### Setup
Install dependancies
```bash
npm install
```
Start development server
```bash
node ./backend/server.js
```
Run app
```bash
npm start
```


### Stack
- React.js
- Mongodb
- Express
- Node.js
- AWS image hosting
- Git

## Process
I decided to make project using the MERN stack with the idea of creating a RESTful API. I chose this due to the fact that it is a stack that I have not used before and fancied the challenge.

I started by splitting the spec into users stories and running through them in order (see below).

For the front end I used React as I have been teaching myself for the past month. As I wanted the app to work like a SPA I decided to utilise the [PopUp module](https://www.npmjs.com/package/reactjs-popup) to serve the forms. I feel like this works well and makes for a very clean UX.

Using Express to serve the app and Mongodb to hold the data worked well. I used an AWS bucket to host the images, when the user uploads the file to the bucket, the url of the image is saved in Mongo and then called when showing the image for the respective games id.

Although it was not in the spec, I decided implement update and delete functions in order to keep the app RESTful.

### Reflection
I learnt a lot whilst undertaking this task, for instance, I learnt how to work with state in a react, I learnt how to deal with CORS errors when sending packages to AWS by using a proxy, and also learnt how to use Mongodb.

I think if I had more time to work on this project I would clean it up considerably by extracting a lot of the functions and forms into seperate components so it is a lot easier to read. 

Though it was not part of the spec I would add a user login feature. I would also add sorting and search functionality to sort through the list of games via their game content.
### User stories

```
As a user
So I can track my games library
I would like to add games to my library
```
```
As a user
So I can see what the game is
I would like to add a games name
```
```
As a user
So I can see what platform my game is
I would like to add a games platform
```
```
As a user
So I can see what genre my game is
I would like to add a games genre
```
```
As a user
So I can see when the game was released
I would like to add a games release date
```
```
As a user
So I can see how many players can play a game
I would like to add number of players
```
```
As a user
So I can see who published a game
I would like to add a games publisher
```
```
As a user
So I can see an image of the game
I would like to add a games box art
```
```
As a user
So I can see a game that I have addeds attributes
I would like to view a specific game
```
```
As a user
So I can remove a game that I don't have anymore
I would like to delete a game
```
```
As a user
So I can change an attribute of a game I have added
I would like to update a game
```




