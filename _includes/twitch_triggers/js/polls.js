SAMMITestTwitchPoll(form) {
  const pollSelect = form.elements['pollType'];
  const amount = parseInt(form.elements['pollChoiceAmount'].value) || getRandomInt(2, 5);
  const duration = form.elements['pollDuration'].value || getRandomInt(60, 600);
  const type = pollSelect.options[pollSelect.selectedIndex].text || 'Created';
  const typeNum = type === 'Created' ? 0 : type === 'Voted' ? 1 : type === 'Ended' ? 2 : 3;
  const allowPoints = !!form.elements['pollAllowPoints'].checked;
  // total votes is 0 if the poll was just Created, else get random amount based on choices amount
  const voteTotal = (type !== 'Created') ? getRandomInt(amount, amount * 50) : 0;
  const baseData = {
    duration: parseInt(duration),
    event: type,
    poll_id: '9dd6a7a7-78f4-46ef-b674-e2864ad7fa07',
    poll_name: 'My Test Poll',
    choice_amount: amount,
    vote_total: voteTotal,
    vote_total_base: 0,
    vote_total_bits: 0,
    vote_total_points: 0,
    top_vote_list: Array.from(Array(amount).keys()),
    channel_points_voting: {
      is_enabled: allowPoints,
      amount_per_vote: 5
    },
    started_at: twitchTimestamp(type === 'Created' ? Date.now() : type === 'Voted' ? Date.now() - Math.floor(Math.random() * parseInt(duration) * 1000) : Date.now() - parseInt(duration) * 1000),
    ends_at: twitchTimestamp(Date.now() + parseInt(duration) * 1000),
  }
const pullData = populateWithChoiceInfo(baseData, amount, type, false, allowPoints, voteTotal);

sendTriggerToSAMMI(
  16,
  `Poll ${type} [test trigger] fired!`,
  {
    type: typeNum,
  },
  pullData,
);
}
