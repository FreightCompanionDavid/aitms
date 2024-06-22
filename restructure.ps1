const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Configuration
const config = {
  rootDir: path.join(__dirname, 'src', 'server'),
  dirs: {
    routes: 'routes',
    controllers: 'controllers',
    middleware: 'middleware',
    services: 'services',
    utils: 'utils',
    models: 'models',
    config: 'config',
    tests: 'tests'
  },
  routes: [
    {
      name: 'users',
      endpoints: [
        { method: 'GET', path: '/', handler: 'getAllUsers' },
        { method: 'GET', path: '/:id', handler: 'getUserById' },
        { method: 'POST', path: '/', handler: 'createUser' },
        { method: 'PUT', path: '/:id', handler: 'updateUser' },
        { method: 'DELETE', path: '/:id', handler: 'deleteUser' }
      ]
    },
    {
      name: 'customs',
      endpoints: [
        { method: 'GET', path: '/', handler: 'getAllCustomsDeclarations' },
        { method: 'POST', path: '/', handler: 'createCustomsDeclaration' },
        { method: 'GET', path: '/:id', handler: 'getCustomsDeclarationById' },
        { method: 'PUT', path: '/:id', handler: 'updateCustomsDeclaration' },
        { method: 'DELETE', path: '/:id', handler: 'deleteCustomsDeclaration' }
      ]
    },
    {
      name: 'freight',
      endpoints: [
        { method: 'GET', path: '/', handler: 'getAllFreight' },
        { method: 'POST', path: '/', handler: 'createFreight' },
        { method: 'GET', path: '/:id', handler: 'getFreightById' },
        { method: 'PUT', path: '/:id', handler: 'updateFreight' },
        { method: 'DELETE', path: '/:id', handler: 'deleteFreight' },
        { method: 'GET', path: '/tracking/:id', handler: 'getFreightTracking' }
      ]
    }
  ]
};

// Error handling
class ProjectGenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProjectGenerationError';
  }
}

// Utility functions
const createDirectory = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } catch (error) {
    throw new ProjectGenerationError(`Error creating directory ${dirPath}: ${error.message}`);
  }
};

const writeFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content.trim() + '\n');
    console.log(`Created/Updated file: ${filePath}`);
  } catch (error) {
    throw new ProjectGenerationError(`Error writing file ${filePath}: ${error.message}`);
  }
};

const createDirectories = async () => {
  const dirs = Object.values(config.dirs).map(dir => path.join(config.rootDir, dir));
  await Promise.all(dirs.map(createDirectory));
};

// Content generation functions
const generateRouteContent = (route) => `
const express = require('express');
const router = express.Router();
const { authenticateToken, validateRequest } = require('../middleware/auth');
const { handleErrors } = require('../middleware/errorHandler');
const ${route.name}Controller = require('../controllers/${route.name}');

${route.endpoints.map(endpoint => `
router.${endpoint.method.toLowerCase()}('${endpoint.path}',
  authenticateToken,
  validateRequest,
  handleErrors(${route.name}Controller.${endpoint.handler})
);`).join('\n')}

module.exports = router;
`;

const generateControllerContent = (route) => `
const ${route.name}Service = require('../services/${route.name}');
const { ApiError } = require('../utils/errors');

class ${route.name.charAt(0).toUpperCase() + route.name.slice(1)}Controller {
  ${route.endpoints.map(endpoint => `
  static async ${endpoint.handler}(req, res) {
    try {
      const result = await ${route.name}Service.${endpoint.handler}(req.params, req.body, req.user);
      res.json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }`).join('\n')}
}

module.exports = ${route.name.charAt(0).toUpperCase() + route.name.slice(1)}Controller;
`;

const generateServiceContent = (route) => `
const { ApiError } = require('../utils/errors');
const ${route.name.charAt(0).toUpperCase() + route.name.slice(1)}Model = require('../models/${route.name}');

class ${route.name.charAt(0).toUpperCase() + route.name.slice(1)}Service {
  ${route.endpoints.map(endpoint => `
  static async ${endpoint.handler}(params, body, user) {
    try {
      // TODO: Implement ${endpoint.handler} logic
      throw new ApiError(501, '${endpoint.handler} not implemented');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error(\`Error in ${endpoint.handler}:\`, error);
      throw new ApiError(500, 'Internal Server Error');
    }
  }`).join('\n')}
}

module.exports = ${route.name.charAt(0).toUpperCase() + route.name.slice(1)}Service;
`;

const generateModelContent = (route) => `
const mongoose = require('mongoose');

const ${route.name}Schema = new mongoose.Schema({
  // Define your schema fields here
  // Example:
  // name: { type: String, required: true },
  // email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('${route.name.charAt(0).toUpperCase() + route.name.slice(1)}', ${route.name}Schema);
`;

const generateTestContent = (route) => `
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const ${route.name.charAt(0).toUpperCase() + route.name.slice(1)}Model = require('../models/${route.name}');

describe('${route.name.charAt(0).toUpperCase() + route.name.slice(1)} API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await ${route.name.charAt(0).toUpperCase() + route.name.slice(1)}Model.deleteMany({});
  });

  ${route.endpoints.map(endpoint => `
  describe('${endpoint.method} ${endpoint.path}', () => {
    it('should ${endpoint.handler}', async () => {
      // TODO: Implement test for ${endpoint.handler}
    });
  });`).join('\n')}
});
`;

// File generation functions
const generateRouteFiles = async () => {
  for (const route of config.routes) {
    const content = generateRouteContent(route);
    await writeFile(path.join(config.rootDir, config.dirs.routes, `${route.name}.js`), content);
  }
};

const generateControllerFiles = async () => {
  for (const route of config.routes) {
    const content = generateControllerContent(route);
    await writeFile(path.join(config.rootDir, config.dirs.controllers, `${route.name}.js`), content);
  }
};

const generateServiceFiles = async () => {
  for (const route of config.routes) {
    const content = generateServiceContent(route);
    await writeFile(path.join(config.rootDir, config.dirs.services, `${route.name}.js`), content);
  }
};

const generateModelFiles = async () => {
  for (const route of config.routes) {
    const content = generateModelContent(route);
    await writeFile(path.join(config.rootDir, config.dirs.models, `${route.name}.js`), content);
  }
};

const generateTestFiles = async () => {
  for (const route of config.routes) {
    const content = generateTestContent(route);
    await writeFile(path.join(config.rootDir, config.dirs.tests, `${route.name}.test.js`), content);
  }
};

// Main function
const generateProjectStructure = async () => {
  try {
    await createDirectories();
    await generateRouteFiles();
    await generateControllerFiles();
    await generateServiceFiles();
    await generateModelFiles();
    await generateTestFiles();

    console.log('Project structure generated successfully.');
    console.log('Next steps:');
    console.log('1. Review and customize the generated files');
    console.log('2. Install dependencies: npm install express mongoose dotenv cors helmet morgan jsonwebtoken supertest jest');
    console.log('3. Set up your .env file with necessary environment variables');
    console.log('4. Implement the logic in your service files');
    console.log('5. Run tests and start your server');
  } catch (error) {
    console.error('An error occurred during project generation:', error.message);
    process.exit(1);
  }
};

// Interactive mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptUser = () => {
  rl.question('Do you want to generate the project structure? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      generateProjectStructure()
        .then(() => {
          console.log('Project structure generated successfully.');
          console.log('Next steps:');
          console.log('1. Review and customize the generated files');
          console.log('2. Install dependencies: npm install express mongoose dotenv cors helmet morgan jsonwebtoken supertest jest');
          console.log('3. Set up your .env file with necessary environment variables');
          console.log('4. Implement the logic in your service files');
          console.log('5. Run tests and start your server');
        })
        .catch((error) => {
          console.error('An error occurred during project generation:', error.message);
        })
        .finally(() => {
          rl.close();
        });
    } else {
      console.log('Project generation cancelled.');
      rl.close();
    }
  });
};

promptUser();
