import test from 'tape';

import Client from '../../lib/index';


import './utils/base64_test';
import './utils/uuid_test';


// Client
test('constructor of client', (t) => {
  let client = new Client({
    scrollKey: 'key'
  , token: 'token'
  });

  t.equal(client instanceof Client, true,
    'should return a new instance of Client');
  t.end();
});

test('The client\'s debug mode', (t) => {
  let client = new Client({
    scrollKey: 'key'
  , token: 'token'
  });

  t.equal(client.debug, false,
    'must be false as default');
  t.end();
});

test('The client\'s scrollKey', (t) => {
  let client = new Client({
    scrollKey: 'key'
  , token: 'token'
  });

  t.equal(client.scrollKey, 'key',
    'should be set via settings argument');
  t.end();
});
