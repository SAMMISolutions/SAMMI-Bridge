async SAMMITestTwitchCharity(form) {
  const typeSelect = form.elements['charityType'];
  const type = typeSelect.options[typeSelect.selectedIndex].value
  const typeEnums = {
    start: 0,
    progress: 1,
    stop: 2,
    donate: 3,
  }
  let pullData; 
  if (type != "donate") {
    pullData = {
      target_amount: 20000,
      charity_website: "https://sammi.solutions",
      started_at: twitchTimestamp(Date.now()),
      event: type,
      charity_description: "Example Description",
      target_amount_currency: "USD",
      charity_name: "Example Charity",
      id: "dce01786-41cf-04c6-6219-a5ebe15bd3c1",
      charity_logo: "https://abc.cloudfront.net/ppgf/1000/100.png",
      current_amount_currency: "USD",
      current_amount: type == "start" ?  0 : getRandomInt(0, 15000),
      type: typeEnums[type],
    }
  }

  else {
    const user = generateName();
    pullData = {
      charity_website: "https://sammi.solutions",
      user_name: user[0].toLowerCase(),
      event: "donate",
      charity_description: "Example Description",
      user_id: user[1],
      campaign_id: "06d77f21-659e-c3e9-1f92-f6201237cddf",
      charity_name: "Example Charity",
      id: "d63da6b1-f0be-48ab-fbd2-6d844e242082",
      display_name: user[0],
      charity_logo: "https://abc.cloudfront.net/ppgf/1000/100.png",
      amount: 1500.0,
      currency: "USD",
      type: typeEnums[type],
    }
  }

  sendTriggerToSAMMI(
    34,
    `Charity ${type} event triggered [test trigger].`,
    {
      type: typeEnums[type],
    },
    pullData,
  );
}