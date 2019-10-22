const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const PORT = 8000;
const app = express();
const routes = require('./routes/routes');
const corsOptions = {
  origin: '*',
  methods: 'GET,POST',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type, Authorization, Content-Length, X-Requested-With'],
};

//////////////////////////// START MIDDLEWARE ///////////////////////////////
// ExpressJS best practices https://expressjs.com/en/advanced/best-practice-security.html
app.use(helmet());
app.use(cors(corsOptions));
// parse the body of all incoming requests for easier access
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// middleware to log requests with response codes
app.use(morgan('dev'));
// set location where static assets on the server can be requested from
app.use(express.static(`${process.cwd()}/app/public`));
// set location to views for server and configure server to use Pug template view engine
app.set('views', './app/views');
app.set('view engine', 'pug');

app.use('/', routes);
//////////////////////////// END MIDDLEWARE ////////////////////////////////

// start the server listening on PORT or exit back to CLI
app.listen(PORT, (err) => {
  /* istanbul ignore next */
  if (!err) {
    process.stdout.write(`Server is running on port ${PORT}!\n`);
  }
});

module.exports = app;
