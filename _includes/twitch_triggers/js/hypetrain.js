async SAMMITestTwitchHypeTrain(form) {
  const hypeSelect = form.elements['hypeTrainType'];
  const type = hypeSelect.options[hypeSelect.selectedIndex].text;
  const currentLevel = parseInt(form.elements['hypeTrainLevel'].value) || 1;
  const currentGoal = parseInt(form.elements['hypeTrainGoal'].value) || getRandomInt(1000, 2000);
  const goalProgres = parseInt(form.elements['hypeTrainProgress'].value) || getRandomInt(100, currentGoal - 50);
  const typeNums = {
    Begin: 1, End: 4, Progress: 6,
  };
  const typeNum = typeNums[type];
  const hypeTrainId = `${getRandomInt(10, 99)}b8f628-5075-4213-95ac-6ceeac9426fe`;
  const lastContributionUser = generateName();
  const topBitsContributionUser = generateName(lastContributionUser);
  const topSubContributionUser = generateName(topBitsContributionUser);
  const last_contribution = {
    user_name: lastContributionUser[0].toLowerCase(),
    user_id: lastContributionUser[1],
    total: getRandomInt(100, 1000),
    display_name: lastContributionUser[0],
    type: getRandomInt(0, 1) === 0 ? 'bits' : 'subscription',
  }
  const top_subscription_contribution = {
    user_name: topSubContributionUser[0].toLowerCase(),
    user_id: topSubContributionUser[1],
    total: getRandomInt(100, 1000),
    display_name: topSubContributionUser[0],

  }
  const top_bits_contribution = {
    user_name: topBitsContributionUser[0].toLowerCase(),
    user_id: topBitsContributionUser[1],
    total: getRandomInt(100, 1000),
    display_name: topBitsContributionUser[0],
  }

  let pullData;

  if (type == "Begin" || type == "Progress") {
    pullData = {
      id: hypeTrainId,
      current_goal: currentGoal,
      goal_progress: goalProgres,
      total_progress: goalProgres,
      expires_at: twitchTimestamp(Date.now() + 1000 * 60 * 60),
      from_channel_id: 93566099,
      event: type.toLowerCase(),
      top_other_contribution: {},
      goal_progress: goalProgres,
      current_goal: currentGoal,
      last_contribution: last_contribution,
      current_level: currentLevel,
      top_subscription_contribution: top_subscription_contribution,
      top_bits_contribution: top_bits_contribution,
    };
  }
  // End
  else {
    pullData = {
      total_progress: goalProgres,
      cooldown_ends_at: twitchTimestamp(Date.now() + 1000 * 60 * 60),
      top_other_contribution: {},
      ended_at: twitchTimestamp(Date.now()),
      id: hypeTrainId,
      last_contribution: last_contribution,
      current_level: currentLevel,
      top_subscription_contribution: top_subscription_contribution,
      top_bits_contribution: top_bits_contribution,
    }
  }

  pullData.event = type.toLowerCase();
  pullData.type = typeNum;

  sendTriggerToSAMMI(
    17,
    `Hype Train ${type} [test trigger] fired!`,
    { type: typeNum },
    pullData,
  );
}
