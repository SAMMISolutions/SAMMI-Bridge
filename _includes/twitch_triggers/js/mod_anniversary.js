async SAMMITestTwitchModAnniversary(form) {
  let name, userID;
  if (!form.elements.name.value) {
    [name, userID] = generateName();
  } else {
    [name, userID] = await getNameFromInput(form.elements.name);
  }
  const months = parseInt(form.elements.modAnniversaryMonths.value) || 6;
  const message = form.elements.modAnniversaryMessage.value || SAMMI.generateMessage();
  const broadcasterUserID = window.defaultTwitchUser.user_id;
  const broadcasterUserName = window.defaultTwitchUser.login;
  const broadcasterDisplayName = window.defaultTwitchUser.display_name;
  const messageId = generateUUID();
  const fragments = [{
    mention: null,
    text: message,
    emote: null,
    type: 'text',
    cheermote: null,
  }];
  const pullData = {
    broadcaster_user_id: broadcasterUserID,
    broadcaster_user_login: broadcasterUserName,
    broadcaster_user_name: broadcasterDisplayName,
    display_name: name,
    user_name: name.toLowerCase(),
    user_id: userID,
    message,
    message_no_emotes: message,
    fragments,
    modiversary: {
      months,
    },
    // mirrors the channel.chat.notification event, the notice types that stay null on a
    // modiversary are left out
    raw_data: {
      broadcaster_user_id: broadcasterUserID,
      broadcaster_user_login: broadcasterUserName,
      broadcaster_user_name: broadcasterDisplayName,
      chatter_user_id: userID,
      chatter_user_login: name.toLowerCase(),
      chatter_user_name: name,
      chatter_is_anonymous: 0,
      color: '#FF0000',
      badges: [{
          info: '',
          id: '1',
          set_id: 'moderator'
        },
        {
          info: '6',
          id: '6',
          set_id: 'subscriber'
        }
      ],
      system_message: `has been a moderator for ${months} months!`,
      message_id: messageId,
      message: {
        text: message,
        fragments,
      },
      notice_type: 'modiversary',
      modiversary: {
        months,
      },
      source_broadcaster_user_id: null,
      source_broadcaster_user_login: null,
      source_broadcaster_user_name: null,
      source_message_id: null,
      source_badges: null,
      is_source_only: null,
    },
  };
  sendTriggerToSAMMI(
    11,
    `${pullData.display_name} celebrated a mod anniversary of ${months} months! [test trigger]`, {
      type: 31,
    },
    pullData,
  );
}
