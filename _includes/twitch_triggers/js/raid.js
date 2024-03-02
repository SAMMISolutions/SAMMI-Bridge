async SAMMITestTwitchRaid(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const amount = parseInt(form.elements.raidAmount.value) || 5;
  const pullData = {
    user_name: name.toLowerCase(),
    display_name: name,
    user_id: userID,
    amount,
    picture_url: "https:\\/\\/static-cdn.jtvnw.net\\/user-default-pictures-uv\\/dbdc9198-def8-11e9-8681-784f43822e80-profile_image-300x300.png"
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
