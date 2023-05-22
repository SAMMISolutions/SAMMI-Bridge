async SAMMITestTwitchChat(form) {
    const [name, userID] = await getNameFromInput(form.elements['name']);
    const message = form.elements['chatMsg'].value || SAMMI.generateMessage();
    const channel = Math.floor(Math.random() * 1000000000).toString();
    const color = '189A8D';
    const emoteList = '304822798:0-9/304682444:11-19';
    const firstTime = form.elements['chatFirstTime'].checked ? '1' : '0';
    const badge = [];
    if (form.elements['chatBroadcaster'].checked) badge.push('broadcaster/1');
    if (form.elements['chatMod'].checked) badge.push('moderator/1');
    if (form.elements['chatVip'].checked) badge.push('vip/1');
    if (form.elements['chatFounder'].checked) badge.push('founder/1');
    if (form.elements['chatSub'].checked) {
        const tier = parseInt(form.elements['chatMsgSubTier'].value);
        let month = form.elements['chatMsgSubMonth'].value != 1 ? parseInt(form.elements['chatMsgSubMonth'].value) : 0;
        month = month > 3 && month < 6
        ? (month = 3)
        : month > 6 && month < 9
          ? (month = 6)
          : month > 9 && month < 12
            ? (month = 9)
            : month;
        const subBadge = tier === 1
        ? `subscriber/${month}`
        : tier === 2
          ? `subscriber/${2000 + month}`
          : `subscriber/${3000 + month}`;
      badge.push(subBadge);
    }

    const pullData = {
      user_name: name.toLowerCase(),
      display_name: name,
      user_id: userID,
      message,
      emote_list: emoteList,
      badge_list: badge.join(','),
      channel,
      name_color: color,
      first_time: firstTime,
      from_channel_id: 123456789,
    };
    SAMMI.trigger(0, {
      message,
      user_name: name.toLowerCase(),
      broadcaster: form.elements['chatBroadcaster'].checked,
      moderator: form.elements['chatMod'].checked,
      sub: form.elements['chatSub'].checked,
      vip: form.elements['chatVip'].checked,
      founder: form.elements['chatFounder'].checked,
      trigger_data: pullData,
    });
  }

