require('dotenv').config();
const express = require('express');

// Exceptions
const NotFoundError = require('./exceptions/NotFoundError');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');

// Token Manager
const TokenManager = require('./tokenize/TokenManager');

// Services
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const CompaniesService = require('./services/postgres/CompaniesService');
const CategoriesService = require('./services/postgres/CategoriesService');
const JobsService = require('./services/postgres/JobsService');
const ApplicationsService = require('./services/postgres/ApplicationsService');
const BookmarksService = require('./services/postgres/BookmarksService');

// Validators
const UsersValidator = require('./validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const CompaniesValidator = require('./validator/companies');
const CategoriesValidator = require('./validator/categories');
const JobsValidator = require('./validator/jobs');
const ApplicationsValidator = require('./validator/applications');

// API Plugins
const users = require('./api/users');
const authentications = require('./api/authentications');
const companies = require('./api/companies');
const categories = require('./api/categories');
const jobs = require('./api/jobs');
const applications = require('./api/applications');
const bookmarks = require('./api/bookmarks');
const profile = require('./api/profile');

const createApp = () => {
  const app = express();

  app.use(express.json());

  // Instantiate services
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const companiesService = new CompaniesService();
  const categoriesService = new CategoriesService();
  const jobsService = new JobsService();
  const applicationsService = new ApplicationsService();
  const bookmarksService = new BookmarksService();

  // Register API routes
  users.register(app, {
    service: usersService,
    validator: UsersValidator,
  });

  authentications.register(app, {
    authenticationsService,
    usersService,
    tokenManager: TokenManager,
    validator: AuthenticationsValidator,
  });

  companies.register(app, {
    service: companiesService,
    validator: CompaniesValidator,
  });

  categories.register(app, {
    service: categoriesService,
    validator: CategoriesValidator,
  });

  jobs.register(app, {
    service: jobsService,
    validator: JobsValidator,
  });

  applications.register(app, {
    service: applicationsService,
    validator: ApplicationsValidator,
  });

  bookmarks.register(app, {
    service: bookmarksService,
  });

  profile.register(app, {
    usersService,
    applicationsService,
    bookmarksService,
  });

  // Handle 404 for unmapped routes
  app.use((req, res, next) => {
    next(new NotFoundError('Resource tidak ditemukan'));
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
