SAMMITestTwitchPrediction(form) {
  const predictSelect = form.elements['predictType'];
  const amount = Math.min(parseInt(form.elements['predictChoiceAmount'].value, 10) || getRandomInt(2, 5), 5);
  const duration = form.elements['predictionDuration'].value || getRandomInt(60, 600);
  const type = predictSelect.options[predictSelect.selectedIndex].text || 'Created';
  const typeNums = {
    Created: 0,
    Voted: 1,
    Locked: 2,
    Resolved: 3,
    Canceled: 4,
  };
  const typeNum = typeNums[type];
  const now = Date.now();
  const startedAt = twitchTimestamp(type === 'Created' ? now : now - parseInt(duration) * 1000);
  const baseData = {
    duration: parseInt(duration),
    outcome_amount: parseInt(amount),
    vote_total: 0,
    vote_total_points: 0,
    from_channel_id: Number(window.defaultTwitchUser.user_id),
    event: type,
    prediction_id: generateUUID(),
    prediction_name: 'My Test Prediction',
    winning_outcome: type === 'Resolved' ? `e960f614-d379-494a-8b45-0c7500978${getRandomInt(0, amount - 1)}ea` : '',
    started_at: startedAt,
    trigger_type: 15,
  };
  if (type === 'Created' || type === 'Voted') {
    baseData.locks_at = twitchTimestamp(now + parseInt(duration) * 1000);
  }
  if (type === 'Locked') {
    baseData.locked_at = twitchTimestamp(now);
  }
  if (type === 'Resolved' || type === 'Canceled') {
    baseData.ended_at = twitchTimestamp(now);
  }
  const pullData = populateWithOutcomeInfo(baseData, amount, type);
  sendTriggerToSAMMI(
    15,
    `Prediction ${type} [test trigger] fired!`, {
      type: typeNum,
    },
    pullData,
  );
}
