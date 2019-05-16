const genPayload = (() => {
  let nextId = 0;
  return (method, params) => ({
    jsonrpc: "2.0",
    id: ++nextId,
    method: method,
    params: params
  });
})();

const send = url => (method, params) => {
  return fetch(url, {
    method: "POST",
    contentType: "application/json-rpc",
    body: JSON.stringify(genPayload(method, params))
  }).then(res => {
    const data = JSON.parse(res._bodyText);

    if (data.error) {
      throw new Error(data.error.message);
    } else {
      return data.result;
    }
  }).catch(e => {
    throw e;
  });
};

module.exports = send;