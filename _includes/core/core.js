/* eslint-disable no-undef */
class SAMMICore {
  constructor() {
    // Grab elements from the DOM once and store references
    this.nIPbox = document.querySelector('#nIPbox');
    this.nPortBox = document.querySelector('#nPortBox');
    this.nPassBox = document.querySelector('#nPassBox');
    this.cnctButton = document.querySelector('#cnctbutton');
    this.retriedWithNewPort = false; // flag to indicate if we have retried with a new port
    this.connectSettings = JSON.parse(localStorage.getItem('lsParams')) || {
      ip: '127.0.0.1',
      port: 9425,
      pass: '',
    };

    // Get Browser Name
    this.browser = (() => {
      const test = (regexp) => regexp.test(window.navigator.userAgent);
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

    // Load connection data and attempt to connect on instantiation
    this.loadConnection();
    this.connectToSAMMI();
  }

  loadConnection() {
    this.nIPbox.value = this.connectSettings.ip || '127.0.0.1';
    this.nPortBox.value = this.connectSettings.port || 9425;
    this.nPassBox.value = this.connectSettings.pass || '';
  }

  connectButton() {
    if (sammiclient && sammiclient._connected) {
      SAMMIVars.force_close = true;
      sammiclient.send('Close');
      sammiclient.disconnect();
      this.connectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
      this.cnctButton.innerText = 'Disconnecting';
    } else {
      console.log('SAMMI manually connected.');
      SAMMICore.tryClearWaitingTimeout();
      this.connectToSAMMI();
    }
  }

  static tryClearWaitingTimeout() {
    try {
      clearTimeout(SAMMIVars.waiting_to_connect);
    } catch (e) { }
  }

  // change connection status
  connectionStatus(id, status, text, fill) {
    document.getElementById(id).className = `${status} d-none d-md-inline-flex`;
    document.getElementById(id).innerHTML = ` ${text}`;
    document.getElementById(`${id}_circle`).setAttribute('fill', fill);
  }

  connectToSAMMI() {
    const debugBridge = document.querySelector('#dbgBridge');
    if (debugBridge) SAMMIDebugLog(debugBridge);

    SAMMICore.tryClearWaitingTimeout();

    const p = SAMMIVars;

    this.connectionStatus('toclient', 'connecting', 'Connecting', 'orange');

    // CONNECT TO SAMMI
    sammiclient.connect({
      address: `${this.nIPbox.value}:${this.nPortBox.value}`,
      password: `${this.nPassBox.value}`,
      name: 'SAMMI Bridge',
    })
      .then(() => {
        // check connection is live in 5 seconds
        setTimeout(() => {
          checkConnection();
        }, 5000);
      })
      .catch((e) => {
        checkConnection();
        // console.log('SAMMI Connection Error', e);
      });

    // CONNECTION OPENED
    sammiclient.on('ConnectionOpened', () => {
      this.cnctButton.innerText = 'Disconnect';
      console.log('SAMMI Connection opened!');
    });

    sammiclient.on('error', () => {
      sammiclient.disconnect();
    });

    // AUTH SUCCESSFUL
    sammiclient.on('AuthenticationSuccess', async () => {
      // Send all extension commands to SAMMI
      sendExtensionCommands(); // Get Twitch list for extension makers

      await SAMMI.getTwitchList().then((data) => {
        window.TWITCH_CLIENT_ID = data.twitch_list.clientId ? data.twitch_list.clientId : window.TWITCH_CLIENT_ID;
      });

      // Save connection params to storage only if we did not retry with a new port
      if (!this.retriedWithNewPort) {
        this.connectSettings.ip = this.nIPbox.value;
        this.connectSettings.port = this.nPortBox.value;
        this.connectSettings.pass = this.nPassBox.value;
        localStorage.setItem('lsParams', JSON.stringify(this.connectSettings));
      }

      // set current browser as global variable
      SAMMI.setVariable('browser_name', this.browser);
      // send extension versions to SAMMI
      waitForExtensions().then(() => {
        SAMMI.setVariable('extensions', window.extensionVersions);
      });
      this.connectionStatus('toclient', 'connected', 'Connected', 'green');
      console.log('SAMMI Authentication successsful!');
    });

    // CONNECTION CLOSED
    sammiclient.on('ConnectionClosed', () => {
      SAMMICore.tryClearWaitingTimeout();
      sammiclient.removeAllListeners();

      // Attempt to reconnect if not manual disconnect
      if (!p.force_close) {
        this.connectionStatus(
          'toclient',
          'disconnected',
          'Disconnected, attempting to reconnect.',
          'red',
        );
        console.log('SAMMI disconnected. Attempting to reconnect in 5s.');
        p.waiting_to_connect = setTimeout(() => {
          this.connectToSAMMI();
        }, 5000);
      } else {
        console.log('SAMMI disconnected by user.');
        this.connectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
      }

      p.force_close = false;
      this.cnctButton.innerText = 'Connect';
    });

    // CONNECTION ERROR
    sammiclient.on('ConnectionError', () => {
      // Try to force close the connection
      try {
        sammiclient.disconnect();
      } catch (e) { }

      console.log('SAMMI connection error.');
    });

    // RELOAD SAMMI Bridge
    sammiclient.on('ResetPlease', () => {
      window.location.reload();
    });

    // PING SAMMI Bridge
    sammiclient.on('UserPing', () => {
      sammiModalElemTitle.innerHTML = 'SAMMI Core';
      sammiModalElemContent.innerHTML = 'Ping received!';
      if (!window.sammiModal) return;
      window.sammiModal.show();
      setTimeout(() => {
        window.sammiModal.hide();
      }, 10000);
      SAMMI.alert(`Ping Received. Your Bridge is running in the following browser: ${this.browser}.`);
    });

    // EXECUTE COMMAND
    sammiclient.on('ExecuteCommand', (json) => {
      SammiExtensionReceived(json.CommandName, json.Data);
    });

    const checkConnection = () => {
      if (!sammiclient._connected) {
        if (sammiclient._socket.readyState == 0) {
          SAMMICore.tryClearWaitingTimeout();
          sammiclient.removeAllListeners();

          // Attempt to reconnect if not manual disconnect
          this.connectionStatus(
            'toclient',
            'disconnected',
            'No response, attempting to reconnect.',
            'red',
          );
          console.log('SAMMI is not responding. Attempting to reconnect in 5s.');
          p.waiting_to_connect = setTimeout(() => {
            this.connectToSAMMI();
          }, 5000);
        }

        // connection is still in connecting state, might be caused by port being hogged, so attempt to reconnect using a new port
        // retry with a new port
        if (!this.retriedWithNewPort) {
          this.retriedWithNewPort = true;
          this.nPortBox.value = parseInt(this.connectSettings.port) + 100;
        }
        // else retry with the same port
        else {
          this.retriedWithNewPort = false;
          this.nPortBox.value = this.connectSettings.port;
        }

      }
    };
  }
}
