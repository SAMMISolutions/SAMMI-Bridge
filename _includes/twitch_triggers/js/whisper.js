async SAMMITestTwitchWhisper(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const message = form.elements.whisperMessage.value || SAMMI.generateMessage();
  const recipientLogin = window.defaultTwitchUser.login;
  const recipientDisplayName = window.defaultTwitchUser.display_name;
  const recipientID = window.defaultTwitchUser.user_id;
  const pullData = {
    sender_user_name: name,
    sender_display_name: name.toLowerCase(),
    sender_user_id: userID,
    sender_color: '000000',
    recipient_user_name: recipientDisplayName,
    recipient_display_name: recipientLogin,
    recipient_user_id: recipientID,
    recipient_color: '000000',
    badge_list: [],
    emote_list: [],
    message,
    sent: 0,
    from_channel_id: Number(recipientID),
    trigger_type: 13,
  };
  sendTriggerToSAMMI(
    13,
    `${pullData.sender_user_name} whispered you! [test trigger]`,
    {
      message,
      sent: 0,
    },
    pullData,
  );
}
