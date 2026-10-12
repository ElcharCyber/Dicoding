const CompaniesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'companies',
  version: '1.0.0',
  register: (app, { service, validator }) => {
    const companiesHandler = new CompaniesHandler(service, validator);
    app.use('/companies', routes(companiesHandler));
  },
};
