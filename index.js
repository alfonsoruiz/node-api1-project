const express = require('express');
const server = express();
const Users = require('./data/db.js');

const port = 4000;
const apiURL = '/api/users';

server.listen(port, () => {
  console.log(`===== Server is running on http://localhost:${port} =====`);
});

server.use(express.json());

//POST
server.post(apiURL, (req, res) => {
  const newUser = req.body;
  const { name, bio } = newUser;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    Users.insert(newUser)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({
          errorMessage:
            'There was an error while saving the user to the database'
        });
      });
  }
});

//GET
server.get(apiURL, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' });
    });
});

//DELETE
server.delete(`${apiURL}/:id`, (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then(deletedUser => {
      if (deletedUser) {
        res
          .status(204)
          .json({ message: `User with id of ${id} was successfuly deleted` });
      } else {
        res
          .status(404)
          .json({ message: `Could not find user with id of ${id}` });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The user could not be removed' });
    });
});

//PUT
server.put(`${apiURL}/:id`, (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const { name, bio } = user;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }

  Users.update(id, user)
    .then(user => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The user information could not be modified.' });
    });
});
