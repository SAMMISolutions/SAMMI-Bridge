async SAMMITestTwitchSubGift(form) {
  const subForm = document.getElementById('SAMMITestTwitchSubs');
  const selectedTierInput = form.querySelector('input[name="giftTier"]:checked');
  const selectedTier = selectedTierInput ? selectedTierInput.value : 'Tier 1';
  const selecterTierNum =
    selectedTier === 'Tier 1' ? 1 :
    selectedTier === 'Tier 2' ? 2 :
    selectedTier === 'Tier 3' ? 4 :
    1;
  // Anonymous community gifts are opted into via the Sub form's "AnonGift" checkbox
  // (the Community Gift form has no anon control of its own). This is only read here,
  // never written, so it does not alter the Sub form.
  const isAnon = subForm.querySelector('[value="anongift"]').checked;
  let gifterName;
  if (isAnon) {
    gifterName = ['Anonymous User', ''];
  } else if (form.elements.gifterName && form.elements.gifterName.value.trim().length > 0) {
    gifterName = await getNameFromInput(form.elements.gifterName);
  } else {
    gifterName = generateName();
  }
  const amount = parseInt(form.elements['subGiftAmount'].value, 10) || 1;
  const pullData = {
    user_name: gifterName[0].toLowerCase(),
    display_name: gifterName[0],
    user_id: gifterName[1],
    amount: amount,
    tier: selectedTier,
    cumulative_total: 0,
  };
  sendTriggerToSAMMI(
    2,
    `${gifterName[0]} has gifted ${amount} ${selectedTier} subs! [test trigger]`, {
      tier: selecterTierNum,
      amount,
    },
    pullData,
  );
  // Spawn the individual gift subs entirely from this Community Gift's own data. We pass
  // every value as an override so the shared Sub form is never read or mutated - that way
  // the two test triggers stay independent (the Sub form's tier/months/message/checkboxes
  // no longer leak into a Community Gift, and a Community Gift no longer changes them).
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      this.SAMMITestTwitchSubs(subForm, null, true, gifterName, {
        tier: selectedTier,
        anon: isAnon,
        subgift: false,
        month: 1,
        message: '',
      });
    }, 1000 + i * 10);
  }
}
