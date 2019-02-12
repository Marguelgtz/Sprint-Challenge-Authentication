const knex = require('knex');

const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
  getUser: (id) => {
    if(id){
      return db('users').where('id', id).first()
    } else {
      return db('users').select('id', 'username')
    }
  },

  register: (creds) => {
    db('users').insert('creds')
  },

  login: (username) => {
    return db('users').where('username', username).first()
  }
};
