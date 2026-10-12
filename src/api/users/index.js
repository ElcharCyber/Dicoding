const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: (app, { service, validator }) => {
    const usersHandler = new UsersHandler(service, validator);
    app.use('/users', routes(usersHandler));
  },
};
