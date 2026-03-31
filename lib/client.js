'use strict';

const BASE_URL = 'https://api.davoxi.com';

/**
 * Make an authenticated request to the Davoxi API.
 *
 * @param {object} z - Zapier z object (for z.request, z.errors, z.JSON)
 * @param {object} bundle - Zapier bundle with authData
 * @param {string} method - HTTP method
 * @param {string} path - API path (e.g. "/businesses")
 * @param {object} [body] - Request body (for POST/PUT)
 * @returns {Promise<object>} Parsed JSON response
 */
const makeRequest = async (z, bundle, method, path, body) => {
  const options = {
    method,
    url: `${BASE_URL}${path}`,
    headers: {
      Authorization: `Bearer ${bundle.authData.api_key}`,
      Accept: 'application/json',
    },
  };

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = body;
  }

  const response = await z.request(options);
  return response.data;
};

module.exports = { makeRequest, BASE_URL };
