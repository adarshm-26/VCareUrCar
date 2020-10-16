const SERVER_HOSTNAME = 'http://localhost';
const SERVER_PORT = '1112';

/**
 * @description Utility method for POST requests, 
 * handle errors in caller function
 * @param {string} url
 * @param {object} body
 * @param {object} options
 * @field getResult set false, if you dont want result object
 * @field withAuth set false, if you dont want Authorization
 * header in request
 */
export const post = async (url, body, { getResult = true, withAuth = true } = {}) => {
  let token = localStorage.getItem('token');
  let headers = {
    'Content-Type': 'application/json',
  };
  if (withAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  let response = await fetch(`${SERVER_HOSTNAME}:${SERVER_PORT}${url}`, {
    method: 'POST',
    headers: headers,
    cache: 'no-cache',
    body: JSON.stringify(body)
  });
  if (response.ok) {
    if (getResult) {
      let result = await response.json();
      return result;
    }
  } else {
    throw new Error('POST error: ' + response.status);
  }
}

/**
 * @description Utility method for GET requests,
 * handle errors in caller function
 * @param {string} url
 * @param {string} type 
 */
export const get = async (url, type = 'json') => {
  let token = localStorage.getItem('token');
  let response = await fetch(`${SERVER_HOSTNAME}:${SERVER_PORT}${url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `application/${type}`,
    },
    cache: 'no-cache'
  });
  if (response.ok && type === 'json') {
    let result = await response.json();
    return result;
  } else if (response.ok && type !== 'json') {
    return response;
  } else {
    throw new Error('GET error: ' + response.status);
  }
}
