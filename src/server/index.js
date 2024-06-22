const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const deprecate = require('depd')('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Import and use route modules
const customsRoutes = require('./routes/customs');
const routeOptimizationRoutes = require('./routes/routeOptimization');
const dangerousGoodsRoutes = require('./routes/dangerousGoods');

app.use('/api/customs', customsRoutes);
app.use('/api/route-optimization', routeOptimizationRoutes);
app.use('/api/dangerous-goods', dangerousGoodsRoutes);

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Cache of loaded parsers.
const parsers = Object.create(null);

// Module exports.
const bodyParserExports = {
  json: createParserGetter('json'),
  raw: createParserGetter('raw'),
  text: createParserGetter('text'),
  urlencoded: createParserGetter('urlencoded')
};

module.exports = deprecate.function(createCombinedParser,
  'bodyParser: use individual json/urlencoded middlewares');

Object.assign(module.exports, bodyParserExports);

/**
 * Create a middleware to parse json and urlencoded bodies.
 *
 * @param {Object} [options]
 * @return {Function}
 * @deprecated
 * @public
 */
function createCombinedParser(options) {
  const opts = { ...options, type: undefined };
  const jsonParser = bodyParserExports.json(opts);
  const urlencodedParser = bodyParserExports.urlencoded(opts);

  return function combinedBodyParser(req, res, next) {
    jsonParser(req, res, (err) => {
      if (err) return next(err);
      urlencodedParser(req, res, next);
    });
  };
}

/**
 * Create a getter for loading a parser.
 * @private
 */
function createParserGetter(name) {
  return function getParser() {
    return loadParser(name);
  };
}

/**
 * Load a parser module.
 * @private
 */
function loadParser(parserName) {
  if (parsers[parserName]) {
    return parsers[parserName];
  }

  let parser;

  switch (parserName) {
    case 'json':
      parser = require('./lib/types/json');
      break;
    case 'raw':
      parser = require('./lib/types/raw');
      break;
    case 'text':
      parser = require('./lib/types/text');
      break;
    case 'urlencoded':
      parser = require('./lib/types/urlencoded');
      break;
    default:
      throw new Error(`Unknown parser type: ${parserName}`);
  }

  return (parsers[parserName] = parser);
}

module.exports = app;
