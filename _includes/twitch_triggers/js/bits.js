async SAMMITestTwitchBits(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const amount = parseInt(form.elements.bitsamount.value) || 50;
  const message = form.elements.bitsmessage.value || SAMMI.generateMessage();
  const pullData = {
    user_name: name.toLowerCase(),
    display_name: name,
    user_id: userID,
    amount: amount,
    message,
  };
  sendTriggerToSAMMI(
    5,
    `${pullData.display_name} donated ${amount} bits! [test trigger]`,
    {
      amount,
    },
    pullData,
  );
}
