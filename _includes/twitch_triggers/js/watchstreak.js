async SAMMITestTwitchWatchStreak(form) {
  let name, userID;
  if (!form.elements.name.value) {
    [name, userID] = generateName();
  } else {
    [name, userID] = await getNameFromInput(form.elements.name);
  }
  const amount = parseInt(form.elements.amount.value) || 5;
  const message = form.elements.message.value || SAMMI.generateMessage();
  const pullData = {
    user_name: name.toLowerCase(),
    display_name: name,
    user_id: userID,
    from_channel_id: 123456789,
    message: message,
    reward: 450,
    amount: amount,
  };
  sendTriggerToSAMMI(
    43,
    `${pullData.display_name} has a watch streak of ${amount}! [test trigger]`, {
      amount
    },
    pullData
  );
}
