async SAMMITestTwitchAdbreak(form) {
    const [name, userID] =  await getNameFromInput(form.elements.name)
    const isAutomatic = form.elements.adbreakAuto.checked ? 1 : 0;
    const pullData = {
      display_name: window.defaultTwitchUser.display_name,
      user_name: window.defaultTwitchUser.login,
      user_id: window.defaultTwitchUser.user_id,
      started_at: twitchTimestamp(Date.now()),
      duration: 60,
      is_automatic: isAutomatic,
      requester_user_id: userID,
      requester_user_name: name.toLowerCase(),
      requester_display_name: name,
    };
    sendTriggerToSAMMI(
      33,
      `Ad break started [test trigger].`,
      {},
      pullData,
    );
  }
  