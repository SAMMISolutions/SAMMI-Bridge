// Connect to PubSub
function connectPubSubserver() {
  const p = LBVars;
  // Do not connect if user's Twitch account isn't linked
  if (Object.keys(p.twitchList).length === 0) {
    ConnectionStatus(
      'topubsub',
      'disconnected',
      'No linked account found.',
      'grey',
    );
    return;
  }
  pubsubserver = new WebSocket('wss://pubsub-edge.twitch.tv');

  function PubSubPing() {
    pubsubserver.send(JSON.stringify({ type: 'PING' }));
  }

  // attempt to reconnect on disconnect, unless LioranBoard is disconnected
  pubsubserver.onclose = () => {
    try { clearInterval(p.pubsubinterval); } catch (e) {}
    const i_obj = {
      topic: 'pubsubdisconnected',
      type: 'MESSAGE',
    };
    ConnectionStatus(
      'topubsub',
      'disconnected',
      'Connection closed. Attempting to reconnect.',
      'red',
    );
    if (lioranboardclient?._connected) connectPubSubserver();
  };

  // once connected, listen for stuff
  pubsubserver.onopen = () => {
    p.pubsubinterval = setInterval(PubSubPing, 120000);
    console.log('Twitch PubSub connected successfully.');
    ConnectionStatus('topubsub', 'connected', 'Connected', 'green');

    // List of available Pubsub topic versions
    const listenTopics = {
      listen_bits: ['bits', 'channel-bits-events-v2'], listen_follow: ['follows', 'following'], listen_moderation: ['mod', 'chat_moderator_actions'], listen_redeem: ['redeem', 'channel-points-channel-v1'], listen_subs: ['subs', 'channel-subscribe-events-v1'], listen_whispers: ['whispers', 'whispers'], listen_hypetrain: ['hypetrain', 'hype-train-events-v1'], listen_predictions: ['predictions', 'predictions-channel-v1'], listen_polls: ['polls', 'polls'],
    };

    // Construct a listen object to send to Pubsub
    function PubsubConstructListen(id, token) {
      this.type = 'LISTEN';
      this.data = { auth_token: token };
      this.changeTopic = (type, topic) => {
        this.nonce = `${type}-${id}`;
        this.data.topics = [`${topic}.${id}`];
      };
    }

    // Go through the Twitch list and listen to everything the user selected
    Object.values(p.twitchList).forEach((params) => {
      const pubsubListen = new PubsubConstructListen(params.user_id, params.token);
      Object.keys(params).forEach((key) => {
        if (key.includes('listen_') && params[key]) {
          pubsubListen.changeTopic(listenTopics[key][0], listenTopics[key][1]);
          pubsubserver.send(JSON.stringify(pubsubListen));
        }
      });
    });
  };

  // Send data from Pubsub to LioranBoard
  pubsubserver.onmessage = (event) => {
    // send pubsub message to lioranboard, let it deal with it
    lioranboardclient.send('PubSubMessage', { Data: JSON.parse(event.data) });
    if (LBDebugPost && p.LBdebug.pubsub) LBDebugPost('pubsub', event.data);
  };
}
