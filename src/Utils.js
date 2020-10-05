const SERVER_HOSTNAME = 'http://localhost';
const SERVER_PORT = '1112';

/**
 * @description Utility method for POST requests, 
 * handle errors in caller function
 * @param {string} url
 * @param {object} body
 * @param {boolean} getResult set false, if you dont want result object
 * @param {boolean} withAuth set false, if you dont want Authorization
 * header in request
 */
export const post = async (url, body, { getResult = true, withAuth = true }) => {
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
  if (response.ok && getResult) {
    let result = await response.json();
    return result;
  } else {
    throw new Error('POST error: ' + response.status);
  }
}

/**
 * @description Utility method for GET requests,
 * handle errors in caller function
 * @param {string} url 
 */
export const get = async (url) => {
  let token = localStorage.getItem('token');
  let response = await fetch(`${SERVER_HOSTNAME}:${SERVER_PORT}${url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-cache'
  });
  if (response.ok) {
    let result = await response.json();
    return result;
  } else {
    throw new Error('GET error: ' + response.status);
  }
}
