async SAMMITestTwitchCustomPowerUps(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const broadcasterDisplayName = window.defaultTwitchUser.display_name;
  const broadcasterUserName = window.defaultTwitchUser.login;
  const broadcasterUserID = window.defaultTwitchUser.user_id;
  const powerUpName = form.elements.customPowerUpName.value || 'SAMMI Test';
  const message = form.elements.customPowerUpMessage.value || SAMMI.generateMessage();
  const costInput = parseFloat(form.elements.customPowerUpBits.value);
  const cost = isNaN(costInput) ? 10 : costInput;
  const pullData = {
    cost,
    redeem_id: generateUUID(),
    broadcaster_display_name: broadcasterDisplayName,
    user_name: name.toLowerCase(),
    broadcaster_user_id: broadcasterUserID,
    broadcaster_user_name: broadcasterUserName,
    user_id: userID,
    message,
    redeemed_at: twitchTimestamp(Date.now()),
    power_up_name: powerUpName,
    display_name: name,
    status: "fulfilled",
    trigger_type: 49,
    power_up_id: generateUUID(),
  };
  sendTriggerToSAMMI(
    49,
    `${pullData.display_name} has redeemed custom power-up ${powerUpName}! [test trigger]`, {
      powerupname: powerUpName,
      message,
      user_name: pullData.user_name,
    },
    pullData,
  );
}
