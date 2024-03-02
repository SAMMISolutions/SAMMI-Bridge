async SAMMITestTwitchStream(form) {
  const typeSelect = form.elements['streamType'];
  const type = typeSelect.options[typeSelect.selectedIndex].value
  const pullData = {
    display_name: window.defaultTwitchUser.display_name,
    user_name: window.defaultTwitchUser.login,
    user_id: window.defaultTwitchUser.user_id,
    started_at: twitchTimestamp(Date.now()),
  };
  if (type == "started") {
    pullData.id = "43355732987";
    pullData.started_at = twitchTimestamp(Date.now() - 120000);
  }

  sendTriggerToSAMMI(
    38,
    `Stream ${type}: ${pullData.display_name} [test trigger].`,
    {
      type: type == "started" ? 0 : 1,
    },
    pullData,
  );
}
