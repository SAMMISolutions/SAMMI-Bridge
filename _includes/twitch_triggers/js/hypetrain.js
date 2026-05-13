async SAMMITestTwitchHypeTrain(form) {
  const hypeSelect = form.elements["hypeTrainType"];
  const typeLabel = hypeSelect.options[hypeSelect.selectedIndex].text; // "Begin" | "Progress" | "End"
  const eventType = typeLabel.toLowerCase(); // "begin" | "progress" | "end"
  const currentLevel = parseInt(form.elements["hypeTrainLevel"]?.value, 10) || 1;
  const goal = parseInt(form.elements["hypeTrainGoal"]?.value, 10) || getRandomInt(500, 2000);
  const progress = parseInt(form.elements["hypeTrainProgress"]?.value, 10) || getRandomInt(1, Math.max(2, goal - 50));
  // In EventSub examples, begin/progress commonly have total==progress. End has total but no progress/goal.
  const total = (typeLabel === "End") ?
    getRandomInt(Math.max(1, progress), Math.max(2, progress + 500)) :
    progress;
  const typeNums = {
    Begin: 1,
    Progress: 6,
    End: 4
  };
  const typeNum = typeNums[typeLabel];
  const hypeTrainId = `${getRandomInt(10, 99)}b8f628-5075-4213-95ac-6ceeac9426fe`;
  const now = Date.now();
  const startedAt = twitchTimestamp(now - getRandomInt(30, 180) * 1000);
  // Helpers for contributions (EventSub v2 shape)
  const makeUser = (avoid = null) => generateName(avoid); // returns [displayName, userId] in your code
  const bitsUser = makeUser();
  const subUser = makeUser(bitsUser); // avoid duplicate
  const top_contributions = [{
      user_id: bitsUser[1].toString(),
      user_login: bitsUser[0].toLowerCase(),
      user_name: bitsUser[0],
      type: "bits",
      total: getRandomInt(10, 500),
    },
    {
      user_id: subUser[1].toString(),
      user_login: subUser[0].toLowerCase(),
      user_name: subUser[0],
      type: "subscription",
      total: getRandomInt(1, 25), // subs count often smaller; tweak if you want
    },
  ];
  // pullData IS the event object directly
  const pullData = {
    // required by you
    event: eventType,
    // common EventSub fields (and your important values)
    id: hypeTrainId,
    broadcaster_user_id: "93566099",
    broadcaster_user_login: "test_channel",
    broadcaster_user_name: "Test_Channel",
    total: total,
    top_contributions: top_contributions,
    level: currentLevel,
    started_at: startedAt,
    type: "regular",
  };
  // Only include fields that exist for each event type
  if (eventType === "begin" || eventType === "progress") {
    pullData.progress = progress;
    pullData.goal = goal;
    pullData.expires_at = twitchTimestamp(now + 60 * 1000);
  }
  if (eventType === "end") {
    pullData.ended_at = twitchTimestamp(now);
    pullData.cooldown_ends_at = twitchTimestamp(now + 60 * 60 * 1000);
  }
  // Begin-only fields
  if (eventType === "begin") {
    pullData.all_time_high_level = Math.max(currentLevel, getRandomInt(currentLevel, currentLevel + 3));
    pullData.all_time_high_total = Math.max(total, getRandomInt(total, total + 3000));
  }
  sendTriggerToSAMMI(
    17,
    `Hype Train ${typeLabel} [test trigger] fired!`, {
      type: typeNum
    },
    pullData
  );
}
