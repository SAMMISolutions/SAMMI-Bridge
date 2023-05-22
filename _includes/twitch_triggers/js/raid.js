async SAMMITestTwitchRaid(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const amount = parseInt(form.elements.raidAmount.value) || 5;
  const pullData = {
    user_name: name.toLowerCase(),
    display_name: name,
    user_id: userID,
    amount,
  };

  sendTriggerToSAMMI(
    4,
    `${pullData.display_name} is raiding you with ${amount} viewers! [test trigger]`,
    {
      amount,
    },
    pullData,
  );
}
