// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/comments');

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Use cors
app.use(cors());

// Create a schema
const commentSchema = new mongoose.Schema({
  text: String
});

// Create a model
const Comment = mongoose.model('Comment', commentSchema);

// Create a route
app.post('/comments', (req, res) => {
  const comment = new Comment({text: req.body.text});
  comment.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.json({message: 'Comment was successfully added.'});
    }
  });
});

app.get('/comments', (req, res) => {
  Comment.find((err, comments) => {
    if (err) {
      res.send(err);
    } else {
      res.json(comments);
    }
  });
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
```

- Let's create the server and run it.

```bash
$ node comments.js
Server is running on port 3001
```

- Now let's create a new React application to display and add comments.

```bash
$ create-react-app comments-app
$ cd comments-app
```

- We need to install axios to make requests to the server.

```bash
$ npm install axios
```

- Now we need to create a form to add comments and a list to display the comments.

```jsx
// File: src/App.js
import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      text: ''
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:3001/comments')
      .then((response) => {
        this.setState({comments: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleTextChange