(function initDebugLogging() {
  dbgBridge.checked = SAMMIVars.SAMMIdebug.core;
  SAMMIDebugLog(dbgBridge);
}());

function SAMMIDebugLog(e) {
  const core = document.getElementById('SAMMIcorelog');
  const listening = '<samp>Listening for traffic.</samp>';
  const disabled = '<samp>Logging is disabled.</samp>';
  // disable or enable debug logging and display it

  if (e.checked) {
    if (localStorage.debug === 'sammi-websocket-js:*') {
      const _debug = console.debug.bind(console);
      logIt = function (...args) {
        const msg = {};
        _debug.apply(console, arguments);
        if (!SAMMIdebugPost) return;
        Object.assign(msg, args[args.length - 2]);
        if (args[0].includes('Sending Message')) SAMMIdebugPost('coreSent', msg);
        else if (args[0].includes('Message received')) {
          SAMMIdebugPost('core', msg);
        }
      };
      window.logIt = logIt;
      core.innerHTML = listening;
    } else {
      core.innerHTML = '<samp>Logging will be enabled once SAMMI Bridge is reloaded.</samp>';
    }
    localStorage.debug = 'sammi-websocket-js:*';
  } else {
    if (localStorage.debug == 0) core.innerHTML = disabled;
    else {
      core.innerHTML = '<samp>Logging will be disabled once SAMMI Bridge is reloaded.</samp>';
    }
    logIt = null;
    localStorage.debug = 0;
  }
  SAMMIVars.SAMMIdebug.core = !!(e.checked);
  localStorage.setItem('SAMMIdebug', JSON.stringify(SAMMIVars.SAMMIdebug));
}

function SAMMIdebugPost(type, msg) {
  const p = SAMMIVars;
  if (!p.SAMMIdebug) return;
  const corelog = document.getElementById('SAMMIcorelog');
  const arrowDown = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-arrow-down" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/> </svg>';
  const arrowUp = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-arrow-up" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/> </svg>';

  // post a message into the debug log if enabled
  if (p.SAMMIdebug.core) {
    const request = msg.rq || msg.upd;
    const { id } = msg;
    try {
      delete msg.id; delete msg.rq;
    } catch (e) {}
    if (request === 'Pong' || request === 'Ping' || msg.upd === 'Ping') return;
    if (msg.rq) {
      corelog.innerHTML += `<br> ${type === 'core' ? arrowUp : arrowDown} <samp>Request: ${request}, Id: ${id}, Data: ${StringifyandReplace(msg)} </samp>`;
    } else {
      corelog.innerHTML += `<br> ${type === 'core' ? arrowUp : arrowDown} <samp>Update: ${request}, Data: ${StringifyandReplace(msg)} </samp>`;
    }
  }

  // stringify if message is an object and replace some symbols
  // for better readability
  function StringifyandReplace(obj) {
    const regexToken = /"token":"[^"]*"/ig;
    if (typeof obj === 'object') obj = JSON.stringify(obj);
    const strRpl = (typeof obj === 'string') ? obj.replace(/\r\n/g, '').replace(/\\/g, '').replace(/\\/g, '').replace(/%s/g, '')
      .replace(/%o/g, '')
      .replace(/%c/g, '')
      .replace(regexToken, '"token":"xxxxxhidden"')
      : obj;
    return strRpl;
  }
}
