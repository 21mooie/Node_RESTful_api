/*
 *Create and export config variables
 */


// container for enviroments
var environments = {};

// Staging (default)

environments.staging = {
    'port' : 3000,
    'envName' : 'staging'
};


environments.production = {
    'port' : 5000,
    'envName' : 'production'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // Check current environment is one of the above environments, if not staging

 var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

 module.exports = environmentToExport;