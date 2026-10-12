const ApplicationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'applications',
  version: '1.0.0',
  register: (app, { service, validator }) => {
    const applicationsHandler = new ApplicationsHandler(service, validator);
    app.use('/applications', routes(applicationsHandler));
  },
};
