async SAMMITestTwitchPoints(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const channelID = generateName[1];
  const redeemName = form.elements.channelPointsName.value || 'Test Reward';
  const userInput = form.elements.channelPointsInput.checked;
  const message = userInput
    ? form.elements.channelPointsMsg.value || SAMMI.generateMessage()
    : '';
  const cost = parseInt(form.elements.channelPointsCost.value) || 50;
  const image = 'https://static-cdn.jtvnw.net/custom-reward-images/default-4.png';
  const rewardId = generateUUID();
  const redeemId = generateUUID();
  const pullData = {
    user_name: name.toLowerCase(),
    display_name: name,
    user_id: userID,
    channel_id: channelID,
    redeem_name: redeemName,
    message,
    cost,
    image,
    reward_id: rewardId,
    redeem_id: redeemId,
  };
  sendTriggerToSAMMI(
    3,
    `${pullData.display_name} has redeemed ${redeemName}! [test trigger]`,
    {
      redeemname: redeemName,
      message,
      user_name: pullData.user_name,
    },
    pullData,
  );
}
