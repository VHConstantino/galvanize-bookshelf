'use strict';

module.exports = {

  test: {
    client: 'postgresql',
    connection: 'postgres://localhost/bookshelf_test'
  },

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/bookshelf_dev'
  },

  production: {

  }
};
