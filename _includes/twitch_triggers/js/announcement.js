async SAMMITestTwitchAnnouncement(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const message = form.elements.announcementMessage.value || SAMMI.generateMessage();
  const color = form.elements.announcementColor.value || 'primary';
  const pullData = {
    message_id: generateUUID(),
    display_name: name,
    user_name: name.toLowerCase(),
    user_id: userID,
    message,
    announcement_color: color,
    badge_list: '',
    fragments: [{
      text: message,
      emote: null,
      type: 'text',
    }],
    emote_list: '',
    message_no_emotes: message,
  };
  sendTriggerToSAMMI(
    35,
    `${pullData.display_name} sent an announcement! [test trigger]`,
    {},
    pullData,
  );
}
