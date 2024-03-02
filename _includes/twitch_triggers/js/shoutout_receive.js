async SAMMITestTwitchShoutoutReceive(form) {
  const [name, userID] = await getNameFromInput(form.elements.name)
  const pullData = {
    from_user_name: name.toLowerCase(),
    from_display_name: name,
    from_user_id: userID,
    started_at: twitchTimestamp(Date.now()),
    viewer_count: getRandomInt(1, 1000),
  };
  sendTriggerToSAMMI(
    37,
    `Shoutout received from ${pullData.from_display_name}! [test trigger]`,
    {},
    pullData,
  );
}
