// load SAMMI connection params from storage
function load_connection() {
  const ls = JSON.parse(localStorage.getItem('lsParams')) || {};
  nIPbox.value = ls.ip || '127.0.0.1';
  nPortBox.value = ls.port || 9425;
  nPassBox.value = ls.pass || '';
}

// manually connect/disconnect from SAMMI via button
function connectbutton() {
  let _sammiclient;
  const p = SAMMIVars;

  if (
    (_sammiclient = sammiclient) !== null
    && _sammiclient !== void 0
    && _sammiclient._connected
  ) {
    p.force_close = true;
    sammiclient.send('Close');
    sammiclient.disconnect();
    ConnectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
    document.querySelector('#cnctbutton').innerText = 'Disconnecting';
  } else {
    console.log('SAMMI manually connected.');

    try {
      clearTimeout(p.waiting_to_connect);
    } catch (e) {}

    connecttosammi();
  }
}

// Connect to SAMMI and listen for events
function connecttosammi() {
  SAMMIDebugLog(dbgBridge);

  try {
    clearTimeout(p.waiting_to_connect);
  } catch (e) {}

  const p = SAMMIVars;

  // CONNECT TO SAMMI
  sammiclient.connect({
    address: `${nIPbox.value || '127.0.0.1'}:${nPortBox.value || 9425}`,
    password: `${nPassBox.value || ''}`,
    name: 'SAMMI Bridge',
  });

  // CONNECTION OPENED
  sammiclient.on('ConnectionOpened', () => {
    document.querySelector('#cnctbutton').innerText = 'Disconnect';
    console.log('SAMMI Connection opened!');
  });
  sammiclient.on('error', (err) => {
    sammiclient.disconnect();
  });

  // AUTH SUCCESSFUL
  sammiclient.on('AuthenticationSuccess', async () => {
    // Send all extension commands to SAMMI
    sendExtensionCommands(); // Get Twitch list for extension makers

    await SAMMI.getTwitchList().then((data) => {
      TWITCH_CLIENT_ID = data.twitch_list.clientId ? data.twitch_list.clientId : TWITCH_CLIENT_ID
      //p.twitchList = data.twitch_list;
    });

    // Save connection params to storage
    const ls = {
      ip: nIPbox.value,
      port: nPortBox.value,
      pass: nPassBox.value,
    };
    localStorage.setItem('lsParams', JSON.stringify(ls));

    // set current browser as global variable
    SAMMI.setVariable('browser_name', browser);

    ConnectionStatus('toclient', 'connected', 'Connected', 'green');
    console.log('SAMMI Authentication successsful!');
  });

  // CONNECTION CLOSED
  sammiclient.on('ConnectionClosed', () => {
    try {
      clearTimeout(p.waiting_to_connect);
    } catch (e) {}

    sammiclient.removeAllListeners();

    // Attempt to reconnect if not manual disconnect
    if (!p.force_close) {
      ConnectionStatus(
        'toclient',
        'disconnected',
        'Disconnected, attempting to reconnect.',
        'red',
      );
      console.log('SAMMI disconnected. Attempting to reconnect in 5s.');
      p.waiting_to_connect = setTimeout(() => {
        connecttosammi();
      }, 5000);
    } else {
      console.log('SAMMI disconnected by user.');
      ConnectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
    }

    p.force_close = false;
    document.querySelector('#cnctbutton').innerText = 'Connect';
  });

  // CONNECTION ERROR
  sammiclient.on('ConnectionError', (e) => {
    // Try to force close the connection
    try {
      sammiclient.disconnect();
    } catch (e) {}

    console.log('SAMMI connection error.');
  });

  // RELOAD SAMMI Bridge
  sammiclient.on('ResetPlease', () => {
    location.reload();
  });

  // EXECUTE COMMAND
  sammiclient.on('ExecuteCommand', (json) => {
    SammiExtensionReceived(json.CommandName, json.Data);
  });
}

// Get Browser Name

const browser = (() => {
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
})();
