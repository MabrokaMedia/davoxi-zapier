'use strict';

const authentication = require('./authentication');

const newBusiness = require('./triggers/new_business');
const newAgent = require('./triggers/new_agent');

const createBusiness = require('./creates/create_business');
const createAgent = require('./creates/create_agent');

const findBusiness = require('./searches/find_business');
const findAgent = require('./searches/find_agent');
const getUsageSummary = require('./searches/get_usage_summary');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  triggers: {
    [newBusiness.key]: newBusiness,
    [newAgent.key]: newAgent,
  },

  creates: {
    [createBusiness.key]: createBusiness,
    [createAgent.key]: createAgent,
  },

  searches: {
    [findBusiness.key]: findBusiness,
    [findAgent.key]: findAgent,
    [getUsageSummary.key]: getUsageSummary,
  },
};
