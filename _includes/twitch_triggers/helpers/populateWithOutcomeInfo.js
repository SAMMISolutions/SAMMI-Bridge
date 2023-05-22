function populateWithOutcomeInfo(obj, amount, type) {
  const voteTotal = (type !== 'Created') ? getRandomInt(amount, amount * 50) : 0;
  // split total votes into parts for each outcome
  const outcomeVotesSplit = [...splitNParts(voteTotal, amount)];
  // create all outcome objects
  for (let i = 0; i < amount; i++) {
    const total_points = outcomeVotesSplit[i];
    // total users are less or equal total votes
    const total_user = total_points !== 0 ? getRandomInt(Math.ceil(total_points / 10), total_points) : 0;
    // avoid having NaN if 0
    const percentage = total_points !== 0 ? parseInt((total_points / voteTotal) * 100) : 0;
    const outcome = {
      total_points, percentage, total_user, id: `e960f614-d379-494a-8b45-0c7500978${i}ea`, name: `Test Choice ${i + 1}`,
    };
    obj[`outcome_${i + 1}_info`] = outcome;
  }
  obj.vote_total = voteTotal;
  return obj;
}
