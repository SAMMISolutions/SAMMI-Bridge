async SAMMITestTwitchSubs(form, notUsed, gifted = false, gifterName = '') {
  const type = 1;
  const month = parseInt(form.elements.submonths.value) || 1;
  const subtype = form.elements.subgift.checked
    ? 2
    : form.elements.anongift.checked
      ? 4
      : gifted
        ? 2
        : 1;
  const context = form.elements.subgift.checked
    ? 'subgift'
    : form.elements.anongift.checked
      ? 'anonsubgift'
      : gifted
        ? 'subgift'
        : month > 1 ? 'resub' : 'sub'
  let name; let userID;
  if (gifted) {
    name = gifterName;
  } else if (form.elements.anongift.checked) {
    name = ['Anonymous User'];
  } else {
    const [customName, customID] = await getNameFromInput(form.elements.name);
    name = [customName, customID];
  }
  const giftedName = subtype !== 1 ? generateName(name[0]) : [''];
  const message = form.elements.submessage.value || SAMMI.generateMessage();
  const tiers = form.querySelectorAll('input[name="tier"]');
  let selectedTier;

  for (const tier of tiers) {
    if (tier.checked) {
      selectedTier = tier.value;
    }
  }

  const selecterTierNum = selectedTier === 'Tier 1'
    ? 1
    : selectedTier === 'Tier 2'
      ? 2
      : selectedTier === 'Tier 3'
        ? 4
        : 8;
  const msg = subtype !== 1
    ? `${name[0]} gifted a sub to ${giftedName[0]}! [test trigger]`
    : `${name[0]} subscribed for ${month} months! [test trigger]`;
  const data = {
    tier: selecterTierNum,
    month,
    subtype,
    communitygift: gifted ? 1 : 0,
  };
  const pullData = {
    user_name: name[0].toLowerCase(),
    display_name: name[0],
    user_id: name[1],
    gifted_user_name: giftedName[0].toLowerCase(),
    gifted_display_name: giftedName[0],
    gifted_user_id: giftedName[1],
    tier: selectedTier,
    context,
    message,
    month,
    community_gift: gifted ? 1 : 0,
    system_message: subtype === 1 ? `${name[0]} subscribed with ${selectedTier}. [test trigger]` : `${name[0]} gifted a ${selectedTier} sub to ${giftedName[0]}! [test trigger]`,
    cumulative_total: 0,
    name_color: "#189A8D",
    emote_list: null,
    message_id: "e2d6ecd6-0ef0-44b7-97f7-cdcd334e1723",
    duration_months: 0,
    badge_list: [ 
    {
        "info": "",
        "id": "1",
        "set_id": "moderator"
    },
    {
        "info": "1",
        "id": "0",
        "set_id": "subscriber"
    }
]


  };
  sendTriggerToSAMMI(type, msg, data, pullData);
}



