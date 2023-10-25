/* eslint-disable no-undef */
class SAMMICore {
  constructor() {
    // Grab elements from the DOM once and store references
    this.contentSettings = document.querySelector("#content-settings");
    this.currentIP = this.contentSettings.querySelector("[name='currentIP']");
    this.currentPort = this.contentSettings.querySelector("[name='currentPort']");
    this.nIPbox = this.contentSettings.querySelector("[name='nIPbox']");
    this.nPortBox = this.contentSettings.querySelector("[name='nPortBox']");
    this.nPassBox = this.contentSettings.querySelector("[name='nPassBox']");
    this.cnctButton = document.querySelector('#cnctbutton');
    this.retriedWithNewPort = false; // flag to indicate if we have retried with a new port
    this.force_close = false;
    this.currentTimeout = null;
    this.attemptedPort = null;
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
    this.initConnection();
    this.connectToSAMMI();
  }

  initConnection() {
    this.nIPbox.value = this.connectSettings.ip || '127.0.0.1';
    this.nPortBox.value = this.connectSettings.port || 9425;
    this.nPassBox.value = this.connectSettings.pass || '';
    this.cnctButton.addEventListener('click', () => {
      this.connectButton();
    });
  }

  connectButton() {
    clearTimeout(this.currentTimeout);
    this.currentTimeout = null;
    sammiclient.removeAllListeners();
    if (sammiclient && sammiclient._connected) {
      // manual disconnect 
      this.force_close = true;
      sammiclient.send('Close');
      sammiclient.disconnect();
      this.connectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
      this.cnctButton.innerText = 'Disconnecting';
    } else {
      // manual connect
      this.force_open = true;
      this.connectSettings.port = parseInt(this.nPortBox.value, 10);  // Update the port
      this.connectSettings.ip = this.nIPbox.value;  // Update the IP
      this.connectSettings.pass = this.nPassBox.value;  // Update the password
      this.connectToSAMMI();
    }
  }

  // change connection status
  connectionStatus(id, status, text, fill) {
    document.getElementById(id).className = `${status} d-none d-md-inline-flex`;
    document.getElementById(id).innerHTML = ` ${text}`;
    document.getElementById(`${id}_circle`).setAttribute('fill', fill);
  }

  checkConnection() {
    if (sammiclient._connected) return;
    const errorMessage = sammiclient._socket.readyState == 0 ? 'No response, attempting to reconnect.' : 'Connection error. Attempting to reconnect.';
    console.log(errorMessage);

    clearTimeout(this.currentTimeout);
    sammiclient.removeAllListeners();

    // Attempt to reconnect if not manual disconnect
    this.connectionStatus(
      'toclient',
      'disconnected',
      errorMessage,
      'red',
    );

    // retry with a new port
    if (!this.retriedWithNewPort) {
      this.retriedWithNewPort = true;
      this.attemptedPort = parseInt(this.connectSettings.port) + 100;
    } else {
      this.retriedWithNewPort = false;
      this.attemptedPort = this.connectSettings.port;
    }

    // reconnect in 2.5 seconds
    this.currentTimeout = setTimeout(() => this.connectToSAMMI(), 2500);
  }

  connectToSAMMI() {
    const debugBridge = document.querySelector('#dbgBridge');
    if (debugBridge) SAMMIDebugLog(debugBridge);

    clearTimeout(this.currentTimeout);
    this.currentTimeout = null;

    this.currentIP.innerHTML = "";
    this.currentPort.innerHTML = "";

    this.connectionStatus('toclient', 'connecting', 'Connecting', 'orange');

    const portToUse = this.retriedWithNewPort ? this.attemptedPort : this.connectSettings.port;

    // CONNECT TO SAMMI
    sammiclient.connect({
      address: `${this.connectSettings.ip}:${portToUse}`,
      password: `${this.connectSettings.pass}`,
      name: 'SAMMI Bridge',
    })
      .then(() => {
        // check connection is live in 5 seconds
        this.connectionErrorOccurred = false;
        this.currentTimeout = setTimeout(() => this.checkConnection(), 2000);
      })
      .catch((e) => {
        this.connectionErrorOccurred = true;
        this.checkConnection();
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
        this.connectSettings.ip = this.nIPbox.value;
        this.connectSettings.port = this.nPortBox.value;
        this.connectSettings.pass = this.nPassBox.value;
        localStorage.setItem('lsParams', JSON.stringify(this.connectSettings));

      this.currentIP.innerHTML = this.connectSettings.ip;
      this.currentPort.innerHTML = this.retriedWithNewPort ? this.attemptedPort : this.connectSettings.port;

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
      // If a connection error just happened, return early
      if (this.connectionErrorOccurred) {
        return;
      }
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
      sammiclient.removeAllListeners();

      this.currentIP.innerHTML = "";
      this.currentPort.innerHTML = "";

      // Attempt to reconnect if not manual disconnect
      if (!this.force_close) {
        this.connectionStatus(
          'toclient',
          'disconnected',
          'Disconnected, attempting to reconnect.',
          'red',
        );
        console.log('SAMMI disconnected. Attempting to reconnect in 5s.');
        this.currentTimeout = setTimeout(() => this.connectToSAMMI(), 5000);
      } else {
        console.log('SAMMI disconnected by user.');
        this.connectionStatus('toclient', 'disconnected', 'Connection Closed', 'red');
      }
      this.force_close = false;
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

  }
}
