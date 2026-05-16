async SAMMITestTwitchAutomaticReward(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const rewardType = form.elements.automaticRewardType.value;
  const costInput = parseInt(form.elements.automaticRewardCost.value, 10);
  const cost = isNaN(costInput) ? 100 : costInput;
  const messageInput = form.elements.automaticRewardMessage.value || SAMMI.generateMessage();
  const emoteId = form.elements.automaticRewardEmoteId.value || '301324829_SG';
  const emoteName = form.elements.automaticRewardEmoteName.value || 'chrizz14Love_SG';
  const messageTypes = [
    'send_highlighted_message',
    'single_message_bypass_sub_mode',
  ];
  const emoteTypes = [
    'random_sub_emote_unlock',
    'chosen_sub_emote_unlock',
    'chosen_modified_sub_emote_unlock',
  ];
  const hasMessage = messageTypes.includes(rewardType);
  const hasEmote = emoteTypes.includes(rewardType);
  const emote = hasEmote ? {
    id: emoteId,
    name: emoteName,
  } : null;
  const pullData = {
    cost,
    redeem_id: generateUUID(),
    user_name: name.toLowerCase(),
    emote,
    from_channel_id: Number(window.defaultTwitchUser.user_id),
    channel_id: window.defaultTwitchUser.user_id,
    user_id: userID,
    redeemed_at: twitchTimestamp(Date.now()),
    display_name: name,
    type: rewardType,
    trigger_type: 40,
  };
  if (hasMessage) {
    pullData.message = messageInput;
    pullData.emote_list = '';
    pullData.fragments = [{
      text: messageInput,
      emote: null,
      type: 'text',
    }];
  }
  sendTriggerToSAMMI(
    40,
    `${pullData.display_name} redeemed ${rewardType}! [test trigger]`,
    {},
    pullData,
  );
}
