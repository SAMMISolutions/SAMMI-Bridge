SAMMITestTwitchSubGift(form) {
  const subForm = document.getElementById('SAMMITestTwitchSubs');
  if (subForm.querySelector('[value="Prime"]').checked) subForm.querySelector('[value="tier1"]').checked = true;
  if (subForm.querySelector('[value="anongift"]').checked === false) subForm.querySelector('[value="subgift"]').checked = true;
  const tiers = subForm.querySelectorAll('input[name="tier"]');
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
        : 1;
  const gifterName = subForm.querySelector('[value="anongift"]').checked
    ? ['Anonymous User']
    : generateName();
  const amount = parseInt(form.elements['subGiftAmount'].value) || 1;
  const pullData = {
    user_name: gifterName[0].toLowerCase(),
    display_name: gifterName[0],
    user_id: gifterName[1],
    amount: `${amount}`,
    tier: selectedTier,
  };
  sendTriggerToSAMMI(
    2,
    `${gifterName[0]} has gifted ${amount} subs! [test trigger]`,
    {
      tier: selecterTierNum,
      amount,
    },
    pullData,
  );

  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      this.SAMMITestTwitchSubs(subForm, null, true, gifterName);
    }, 1000 + i * 10);
  }
}
