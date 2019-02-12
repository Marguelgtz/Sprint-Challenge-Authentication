require('dotenv').config()
const axios = require('axios');
const bcrypt = require('bcryptjs')
const db = require('../database/dbConfig')

const { authenticate, generateToken } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const creds = req.body
  const hash = bcrypt.hashSync(creds.password, 12)
  creds.password = hash
  if(creds.username && creds.password) {
    db.register(creds)
      then(ids => {
        const id = ids[0]
        db.getUser(id)
          .then(user => {
            const token = generateToken(user)
            res
              .status(201)
              .json({token})
          })
          .catch(() => {
            res
              .status(500)
              .json({message: 'Failed to Authenticate'})
          })
      })
      .catch(() => {
        res
          .status(500)
          .json({message: 'Failed to register'})
      })
  } else {
    res
      .status(404)
      .json({message: 'username/password Missing'})
  }
}

function login(req, res) {
  // implement user login
  const creds = req.body
  if(creds.username && creds.password) {
    db.login(creds.username)
      .then(user => {
        if(user.password && bcrypt.compareSync(creds.password, user.password)) {
          res
            .status(200)
            json({message:'Welcome'})
        } else {
          res
            .status(403)
            .json({message: 'Failed to authenticate'})
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({message: 'Failed to login'})
      })
  } else {
    res
      .status(404)
      .json({message: 'username/password Missing'})
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
