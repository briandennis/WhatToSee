# WhatToSee

<p align="center"><img src="public/images/logo.png" height="150"/></p>

> Unfortunately, Rotten Tomatoes, who previously provided the training data, no longer provides an open API. As such, this application no longer works as intended 🙁

## About

[What To See?](https://whattosee.herokuapp.com/) helps you choose which movie in theaters you should go see. 

The prediction is made by an artificial neural network which uses movies the user rates as training points. Each movie has several input features including: 

* Year
* Runtime
* Rotten Tomatoes critic score
* Rotten Tomatoes user score
* IMDB rating
* Metacritic score

The users attributed score is the output for the training points. 

##Technology

### Client Side

* [ReactJS](https://facebook.github.io/react/)
* [Bootstrap](http://getbootstrap.com/)
* [Brain](https://github.com/harthur/brain)

### Server Side

* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](http://expressjs.com/)

##TODO 

- [X] ~~Write second API to get movies currently out~~
- [ ] Submit movies on enter key 
- [ ] Fade animations
- [ ] Prevent users from submitting same movie multiple times
- [ ] Make responsive

