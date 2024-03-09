function populateWithOutcomeInfo(obj, amount, type) {
  const voteTotal = type !== 'Created' ? getRandomInt(amount, amount * 50) : 0;

  // Initialize outcomeVotesSplit with zeros
  const outcomeVotesSplit = [];
  for (let i = 0; i < amount; i++) {
    outcomeVotesSplit[i] = 0;
  }

  let remainingVotes = voteTotal;

  // Distribute votes evenly across choices
  for (let i = 0; i < amount - 1; i++) {
    if (voteTotal > 0 && amount > 1) {
      const part = getRandomInt(1, remainingVotes - (amount - i - 1));
      outcomeVotesSplit[i] = part;
      remainingVotes -= part;
    }
  }
  // Assign remaining votes to the last element
  outcomeVotesSplit[amount - 1] = remainingVotes;

  for (let i = 0; i < amount; i++) {
    const totalPoints = outcomeVotesSplit[i];
    const totalUsers = totalPoints !== 0 ? getRandomInt(Math.ceil(totalPoints / 10), totalPoints) : 0;
    const percentage = totalPoints !== 0 ? parseInt((totalPoints / voteTotal) * 100) : 0;

    const topPredictors = generateTopPredictors(type, totalUsers, totalPoints);

    obj[`outcome_${i + 1}_info`] = {
      total_points: totalPoints,
      percentage: percentage,
      total_user: totalUsers,
      id: `e960f614-d379-494a-8b45-0c7500978${i}ea`,
      name: `Test Choice ${i + 1}`,
      color: 'blue',
      top_predictors: topPredictors
    };
  }
  obj.vote_total = voteTotal;
  return obj;
}

function generateTopPredictors(type, totalUsers, totalPoints) {
  let topPredictors = [];
  let totalChannelPointsUsed = 0;

  for (let userCount = 0; userCount < totalUsers; userCount++) {
    const remainingPoints = totalPoints - totalChannelPointsUsed;
    const channelPointsUsed = userCount === totalUsers - 1 ? remainingPoints : getRandomInt(1, remainingPoints);
    totalChannelPointsUsed += channelPointsUsed;
    const username = generateName();
    topPredictors.push({
      "channel_points_used": channelPointsUsed,
      "channel_points_won": null,
      "user_name": username[0],
      "user_id": username[1],
      "user_login": username[0].toLowerCase()
    });
  }

  return topPredictors;
}
