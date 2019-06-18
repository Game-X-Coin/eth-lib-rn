const ETH_CALL_FAILED = '0x08c379a0';

const genPayload = (() => {
  let nextId = 0;
  return (method, params) => ({
    jsonrpc: '2.0',
    id: ++nextId,
    method: method,
    params: params
  });
})();

const send = url => (method, params) => {
  return fetch(url, {
    method: 'POST',
    contentType: 'application/json-rpc',
    body: JSON.stringify(genPayload(method, params))
  }).then(async res => {
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.message);
    } else {
      if (method === 'eth_call' && data.result.slice(0, 10) === ETH_CALL_FAILED) {
        const errorFromHex = data.result.slice(10).match(/.{1,2}/g).map(str => String.fromCharCode(parseInt('0x' + str, 16))).join('');

        throw new Error(errorFromHex);
      }

      return data.result;
    }
  }).catch(e => {
    throw e;
  });
};

module.exports = send;