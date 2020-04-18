function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function handleResponse(handleAs, response) {
  switch (handleAs) {
    case 'text':
      return response.text();
    default:
      return response.json();
  }
}

function objectToUrlSearchParams(obj) {
  const body = new URLSearchParams();
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      body.append(prop, obj[prop]);
    }
  }

  // add f=json if not included
  if (!body.has('f')) {
    body.append('f', 'json');
  }

  return body.toString();
}

function getHeaders(isFormData) {
  const headers = {};

  if (!isFormData) {
    headers['content-type'] = 'application/x-www-form-urlencoded';
  }

  return new Headers(headers);
}

function getRequestBody(data, isFormData) {
  // if formdata, make formdata
  if (isFormData) {
    return this.objectToFormData(data);
  }

  // Not formdata, make url param
  return objectToUrlSearchParams(data);
}

/**
 * Make a request using fetch()
 * @param  { Object } params Object containing key/value parameters to pass to fetch()
 * @return { Promise}        Promise returned by fetch()
 */
export function makeRequest(params) {
  return new Promise((resolve, reject) => {
    let url = params.url;
    const data = params.data || {};
    const headers = getHeaders(params.isFormData);
    const options = {
      method: params.method || 'get',
      headers,
    };

    if (!params.hideCredentials) {
      options.credentials = 'include';
    }

    let body = getRequestBody(data, params.isFormData);

    if (options.method === 'get') {
      url = `${url}?${body}`;
    } else {
      options.body = body;
    }

    fetch(url, options)
      .then(status)
      .then(handleResponse.bind(null, params.handleAs))
      .then(function (data) {
        // Handle successful requests that are actually errors...
        if (data.error) {
          reject(data.error);
          return;
        }
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export function getConfig() {
  return new Promise((resolve, reject) => {
    makeRequest({
      url: `/locdesc/config.json`,
      method: 'get',
    }).then((resp) => resolve(resp));
  });
}
