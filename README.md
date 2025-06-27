# NC News Frontend

This repo serves as the frontend to a full-stack Reddit-style messageboard.

- Visit the [NC News Backend](https://github.com/laureneyfs/NC-News)

- Visit the [Deployed Frontend](https://nc-news-lauren.netlify.app/)

- Visit the [Hosted API](https://nc-news-3uk2.onrender.com/api/)

## Installation

note: created on node v24.0.2 - earlier versions may work but haven't been tested!

- fork this repo (optional, but allows for adjustments to the code)

- clone your forked copy with `git clone [FORKED REPO LINK]`

- navigate to the folder from your terminal with `cd`

- install necessary dependencies with `npm install`

## Getting Started

- if you would like to point to your own hosted API, the filepath can be changed from `./src/api/api.js`

- `npm run dev` to locally host this frontend.

## Features

### 'Guest' features

- view all articles on the backend, optionally filtered by various fields

- view a user's profile, containing their recent articles and an overview of their activity

- view all topics on the backend, that can be clicked through to view articles on that topic

- view a single article and its comments

- log in to a user account

### Logged In Features

- post an article or delete articles you've made

- vote on articles and comments made by other users

- post or delete a comment on an article

## portfolio considerations

- This frontend does not handle authentication of users - it instead has a 'change user' page to change your user. This isn't how this would work in reality of course, but is done to demonstrate understanding of the context API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
