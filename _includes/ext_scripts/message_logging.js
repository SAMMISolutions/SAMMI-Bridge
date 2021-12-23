(function initDebugLogging() {
  dbgReceiver.checked = LBVars.LBdebug.receiver;
  dbgPubsub.checked = LBVars.LBdebug.pubsub;
  LBDebugLog(dbgPubsub); LBDebugLog(dbgReceiver);
}());

function LBDebugLog(e) {
  const receiver = document.getElementById('LBreceiverlog');
  const pubsub = document.getElementById('LBpubsublog');
  const listening = '<samp>Listening for traffic.</samp>';
  const disabled = '<samp>Logging is disabled.</samp>';
  // disable or enable debug logging and display it

  switch (e.id) {
    default:
      break;
    case 'dbgReceiver':
      if (e.checked) {
        if (localStorage.debug === 'lb-websocket-js:*') {
          const _debug = console.debug.bind(console);
          logIt = function (...args) {
            const msg = {};
            _debug.apply(console, arguments);
            if (!LBDebugPost) return;
            Object.assign(msg, args[args.length - 2]);
            if (args[0].includes('Sending Message')) LBDebugPost('receiverSent', msg);
            else if (args[0].includes('Message received')) {
              LBDebugPost('receiver', msg);
            }
          };
          receiver.innerHTML = listening;
        } else {
          receiver.innerHTML = '<samp>Logging will be enabled once Transmitter is reloaded.</samp>';
        }
        localStorage.debug = 'lb-websocket-js:*';
      } else {
        if (localStorage.debug == 0) receiver.innerHTML = disabled;
        else {
          receiver.innerHTML = '<samp>Logging will be disabled once Transmitter is reloaded.</samp>';
        }
        logIt = null;
        localStorage.debug = 0;
      }
      LBVars.LBdebug.receiver = !!(e.checked);
      break;
    case 'dbgPubsub':
      pubsub.innerHTML = (e.checked) ? listening : disabled;
      LBVars.LBdebug.pubsub = !!(e.checked);
      break;
  }
  localStorage.setItem('LBdebug', JSON.stringify(LBVars.LBdebug));
}

function LBDebugPost(type, msg) {
  const p = LBVars;
  if (!p.LBdebug) return;
  const receiverlog = document.getElementById('LBreceiverlog');
  const pubsublog = document.getElementById('LBpubsublog');
  const arrowDown = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-arrow-down" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/> </svg>';
  const arrowUp = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-arrow-up" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/> </svg>';

  // post a message into the debug log if enabled
  switch (type) {
    default:
      break;
    case 'receiver':
    case 'receiverSent':
      if (p.LBdebug.receiver) {
        const request = msg.rq;
        const { id } = msg;
        try {
          delete msg.id; delete msg.rq;
        } catch (e) {}
        if (request === 'Pong' || request === 'Ping' || msg.upd === 'Ping') return;
        receiverlog.innerHTML += `<br> ${type === 'receiver' ? arrowUp : arrowDown} <samp>Request: ${request}, Id: ${id}, Data: ${StringifyandReplace(msg)} </samp>`;
      }
      break;
    case 'pubsub':
      console.log(msg);
      if (p.LBdebug.pubsub && !msg.includes('PONG')) pubsublog.innerHTML += `<br> ${arrowDown} <samp>${StringifyandReplace(msg)} </samp>`;
      break;
  }

  // stringify if message is an object and replace some symbols
  // for better readability
  function StringifyandReplace(obj) {
    if (typeof obj === 'object') obj = JSON.stringify(obj);
    const strRpl = (typeof obj === 'string') ? obj.replace(/\r\n/g, '').replace(/\\/g, '').replace(/\\/g, '').replace(/%s/g, '')
      .replace(/%o/g, '')
      .replace(/%c/g, '') : obj;
    return strRpl;
  }
}