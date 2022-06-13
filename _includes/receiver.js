// load LB connection params from storage
function load_connection() {
  const ls = JSON.parse(localStorage.getItem('lsParams')) || {};
  nIPbox.value = ls.ip || '127.0.0.1';
  nPortBox.value = ls.port || 9425;
  nPassBox.value = ls.pass || '';
}

// manually connect/disconnect from LB via button
function connectbutton() {
  let _lioranboardclient;

  const p = LBVars;

  if (
    (_lioranboardclient = lioranboardclient) !== null
    && _lioranboardclient !== void 0
    && _lioranboardclient._connected
  ) {
    p.force_close = true;
    lioranboardclient.send('Close');
    lioranboardclient.disconnect();
    ConnectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
    document.querySelector('#cnctbutton').innerText = 'Disconnecting';
  } else {
    console.log('LioranBoard Manual Connection.');

    try {
      clearTimeout(p.waiting_to_connect);
    } catch (e) {}

    connecttoboard();
  }
}

// Connect to LB and listen for events
function connecttoboard() {
  LBDebugLog(dbgReceiver);

  try {
    clearTimeout(p.waiting_to_connect);
  } catch (e) {}

  const p = LBVars;

  // CONNECT TO LIORANBOARD
  lioranboardclient.connect({
    address: `${nIPbox.value || '127.0.0.1'}:${nPortBox.value || 9425}`,
    password: `${nPassBox.value || ''}`,
    name: 'Transmitter',
  });

  // CONNECTION OPENED
  lioranboardclient.on('ConnectionOpened', () => {
    document.querySelector('#cnctbutton').innerText = 'Disconnect';
    console.log('LioranBoard Connection opened!');
  });
  lioranboardclient.on('error', (err) => {
    lioranboardclient.disconnect();
  });

  // AUTH SUCCESSFUL
  lioranboardclient.on('AuthenticationSuccess', async () => {
    // Send all extension commands to LB
    sendExtensionCommands(); // Get Twitch list and connect to Pubsub

    await LB.getTwitchList().then((data) => {
      TWITCH_CLIENT_ID = data.twitch_list.clientId ? data.twitch_list.clientId : TWITCH_CLIENT_ID
      p.twitchList = data.twitch_list;
      connectPubSubserver();
    });

    // Save connection params to storage
    const ls = {
      ip: nIPbox.value,
      port: nPortBox.value,
      pass: nPassBox.value,
    };
    localStorage.setItem('lsParams', JSON.stringify(ls));

    // set current browser as global variable
    LB.setVariable('browser_name', browser);

    ConnectionStatus('toclient', 'connected', 'Connected', 'green');
    console.log('LioranBoard Authentication successsful!');
  });

  // CONNECTION CLOSED
  lioranboardclient.on('ConnectionClosed', () => {
    try {
      clearTimeout(p.waiting_to_connect);
    } catch (e) {}

    lioranboardclient.removeAllListeners();

    // Attempt to force disconnect from PubSub
    try {
      pubsubserver.close();
    } catch (e) {}

    // Attempt to reconnect if not manual disconnect
    if (!p.force_close) {
      ConnectionStatus(
        'toclient',
        'disconnected',
        'Disconnected, attempting to reconnect.',
        'red',
      );
      console.log('LioranBoard disconnected. Attempting to reconnect in 2s.');
      p.waiting_to_connect = setTimeout(() => {
        connecttoboard();
      }, 2000);
    } else {
      console.log('LioranBoard disconnected by user.');
      ConnectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
    }

    p.force_close = false;
    document.querySelector('#cnctbutton').innerText = 'Connect';
  });

  // CONNECTION ERROR
  lioranboardclient.on('ConnectionError', (e) => {
    // Try to force close the connection
    try {
      lioranboard.disconnect();
    } catch (e) {}

    console.log('LioranBoard Connection error');
  });

  // RELOAD TRANSMITTER
  lioranboardclient.on('ResetPlease', () => {
    location.reload();
  });

  // EXECUTE COMMAND
  lioranboardclient.on('ExecuteCommand', (json) => {
    LBExtensionReceived(json.CommandName, json.Data);
  });
}

// Get Browser Name

const browser = (function () {
  const test = function (regexp) { return regexp.test(window.navigator.userAgent); };
  switch (true) {
    case test(/OBS/i): return 'OBS';
    case test(/edg/i): return 'Microsoft Edge';
    case test(/trident/i): return 'Microsoft Internet Explorer';
    case test(/firefox|fxios/i): return 'Mozilla Firefox';
    case test(/opr\//i): return 'Opera';
    case test(/ucbrowser/i): return 'UC Browser';
    case test(/samsungbrowser/i): return 'Samsung Browser';
    case test(/chrome|chromium|crios/i): return 'Google Chrome';
    case test(/safari/i): return 'Apple Safari';
    default: return 'Other';
  }
}());
