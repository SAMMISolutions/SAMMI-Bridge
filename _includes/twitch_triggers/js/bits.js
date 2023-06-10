async SAMMITestTwitchBits(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const amount = parseInt(form.elements.bitsamount.value) || 50;
  const totalAmount = parseInt(form.elements.bitstotal.value) || amount + 100;
  const message = form.elements.bitsmessage.value || SAMMI.generateMessage();
  const pullData = {
    user_name: name.toLowerCase(),
    // display_name: name, // bits don't display name
    user_id: userID,
    amount: amount,
    total_amount: totalAmount,
    message,

  };
  sendTriggerToSAMMI(
    5,
    `${pullData.user_name} donated ${amount} bits! [test trigger]`,
    {
      amount,
    },
    pullData,
  );
}
