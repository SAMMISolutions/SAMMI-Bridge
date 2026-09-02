async SAMMITestTwitchChat(form) {
  const [name, userID] = await getNameFromInput(form.elements['name']);
  const messageText = form.elements['chatMsg'].value || SAMMI.generateMessage();
  const hasGif = form.elements['chatGif'].checked;
  const gifId = 'joSNxeswxuc74Juo8X';
  const gifText = '[Y A Y Yes GIF by Djemilah Birnie]';
  const gifUrl = 'https://media4.giphy.com/media/joSNxeswxuc74Juo8X/giphy.gif?cid=095d7a5dzizsiwgabonagkmigggv8v1spfai91ac3x0dsiy0&ep=v1_gifs_trending&rid=giphy.gif&ct=g';
  const message = hasGif ? `${messageText} ${gifText}` : messageText;
  const fragments = [{
    text: hasGif ? `${messageText} ` : messageText,
    emote: null,
    type: 'text',
  }];
  const gifList = hasGif
    ? `${messageText.length + 1}-${message.length - 1}|${gifId}|${gifUrl}`
    : '';
  if (hasGif) {
    fragments.push({
      text: gifText,
      type: 'gif',
      gif: {
        id: gifId,
        gif_id: gifId,
        url: gifUrl,
      },
    });
  }
  const channelId = window.defaultTwitchUser.user_id;
  const channel = window.defaultTwitchUser.login;
  const color = '008000';
  const messageId = generateUUID();
  const firstTime = form.elements['chatFirstTime'].checked ? '1' : '0';
  const isBroadcaster = form.elements['chatBroadcaster'].checked ? 1 : 0;
  const isLeadModerator = form.elements['chatLeadModerator'].checked ? 1 : 0;
  const isModerator = form.elements['chatMod'].checked || isLeadModerator ? 1 : 0;
  const isSubscriber = form.elements['chatSub'].checked ? 1 : 0;
  const isVip = form.elements['chatVip'].checked ? 1 : 0;
  const isFounder = form.elements['chatFounder'].checked ? 1 : 0;
  const isOwnChat = form.elements['chatOwnChat'].checked ? 1 : 0;
  const isTurbo = form.elements['chatTurbo'].checked ? 1 : 0;
  const badges = [];
  if (isBroadcaster) badges.push('broadcaster/1');
  if (isLeadModerator) badges.push('lead_moderator/1');
  if (isModerator && !isLeadModerator) badges.push('moderator/1');
  if (isSubscriber) badges.push('subscriber/6');
  if (isVip) badges.push('vip/1');
  if (isFounder) badges.push('founder/1');
  if (isTurbo) badges.push('turbo/1');
  const badgeList = badges.join(',');
  const pullData = {
    source_room_id: '',
    reply_parent_display_name: '',
    is_vip: isVip,
    reply_parent_user_login: '',
    reply_parent_user_id: '',
    user_name: name.toLowerCase(),
    is_subscriber: isSubscriber,
    is_lead_moderator: isLeadModerator,
    reply_thread_parent_msg_id: '',
    from_channel_id: Number(channelId),
    name_color: color,
    user_id: userID,
    room_id: channelId,
    is_mod: isModerator,
    message,
    source_badges: '',
    unix_timestamp: Date.now().toString(),
    reply_parent_msg_body: '',
    first_time: firstTime,
    reply_parent_msg_id: '',
    source_badge_info: '',
    emote_list: '',
    gif_list: gifList,
    fragments,
    message_no_emotes: messageText,
    is_founder: isFounder,
    is_broadcaster: isBroadcaster,
    source_id: '',
    is_own_chat: isOwnChat,
    reply_thread_parent_user_login: '',
    bits: '',
    channel,
    display_name: name,
    message_id: messageId,
    is_turbo: isTurbo,
    custom_reward_id: '',
    trigger_type: 0,
    badge_list: badgeList,
  };
  SAMMI.trigger(0, {
    message,
    user_name: pullData.user_name,
    broadcaster: isBroadcaster,
    moderator: isModerator,
    lead_moderator: isLeadModerator,
    sub: isSubscriber,
    vip: isVip,
    founder: isFounder,
    is_own_chat: isOwnChat,
    trigger_data: pullData,
  });
}
