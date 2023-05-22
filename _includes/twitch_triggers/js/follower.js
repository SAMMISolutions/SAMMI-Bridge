async SAMMITestTwitchFollow(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const pullData = {
    user_name: name.toLowerCase(),
    display_name: name,
    user_id: userID,
  };
  sendTriggerToSAMMI(
    6,
    `${pullData.display_name} followed you! [test trigger]`,
    {},
    pullData,
  );
}
