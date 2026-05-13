async SAMMITestTwitchSubGift(form) {
  const subForm = document.getElementById('SAMMITestTwitchSubs');
  const selectedTierInput = form.querySelector('input[name="giftTier"]:checked');
  const selectedTier = selectedTierInput ? selectedTierInput.value : 'Tier 1';
  const selecterTierNum =
    selectedTier === 'Tier 1' ? 1 :
    selectedTier === 'Tier 2' ? 2 :
    selectedTier === 'Tier 3' ? 4 :
    1;
  let gifterName;
  if (subForm.querySelector('[value="anongift"]').checked) {
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
  const tierRadio = subForm.querySelector(`input[name="tier"][value="${selectedTier}"]`);
  if (tierRadio) tierRadio.checked = true;
  if (subForm.querySelector('[value="anongift"]').checked === false) {
    subForm.querySelector('[value="subgift"]').checked = true;
  }
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      this.SAMMITestTwitchSubs(subForm, null, true, gifterName);
    }, 1000 + i * 10);
  }
}
