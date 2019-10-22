const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const PORT = 8000;
const app = express();
const routes = require('./routes/routes');

//////////////////////////// START MIDDLEWARE ///////////////////////////////
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.disable('x-powered-by');
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
