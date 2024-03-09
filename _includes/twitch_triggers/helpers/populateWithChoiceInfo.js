function populateWithChoiceInfo(obj, amount, type, allowBits, allowPoints, voteTotal) {
  // split total votes into parts for each choice
  const choiceVotesSplit = [...splitNParts(voteTotal, amount)];
  const topVotes = { ...choiceVotesSplit };
  const topVotesSorted = Object.keys(topVotes)
  .sort((a, b) => parseInt(topVotes[b]) - parseInt(topVotes[a]))
  .map(key => parseInt(key));

obj.top_vote_list = topVotesSorted;

  for (let i = 0; i < amount; i++) {
    const choiceInfo = {};
    const choiceInfoVotes = {};
    const choiceInfoTokens = {};
    const baseValue = 0;
    // fill all possible fields with 0 base value
    ['percentage', 'total_voters'].forEach((val) => choiceInfo[val] = baseValue);
    ['base', 'bits', 'channel_points', 'total'].forEach((val) => choiceInfoVotes[val] = baseValue);
    ['bits', 'channel_points'].forEach((val) => choiceInfoTokens[val] = baseValue);
    choiceInfo.choice_id = `ddb2f066-1e36-4099-a71b-50621f90b${i}cd`;
    choiceInfo.title = `Test Choice ${i + 1}`;
    if (type !== 'Created' && choiceVotesSplit[i] !== 0) {
      // split into base, bits and points votes amount based on total choice votes
      const choiceVotesTypeSplit = (allowBits && allowPoints) ? [...splitNParts(choiceVotesSplit[i], 3)] : (allowBits || allowPoints) ? [...splitNParts(choiceVotesSplit[i], 0), 0] : [choiceVotesSplit[i], 0, 0];
      choiceInfo.percentage = parseInt((choiceVotesSplit[i] / voteTotal) * 100);
      // total voters will be the same as total votes if no bits or points are enabled
      choiceInfo.total_voters = (allowBits || allowPoints) ? getRandomInt(choiceVotesSplit[i], choiceVotesSplit[i] / 10) : choiceVotesSplit[i];
      // populate the different vote types based on if bits and points are enabled or not
      choiceInfoVotes.total = choiceVotesSplit[i];
      choiceInfoVotes.base = choiceVotesTypeSplit[0];
      choiceInfoVotes.bits = allowBits ? choiceVotesTypeSplit[1] : 0;
      choiceInfoVotes.channel_points = allowPoints ? choiceVotesTypeSplit[2] || choiceVotesTypeSplit[1] : 0;
      // tokens are when someone votes with 5 channel points, they get 1 vote and 5 tokens?
      choiceInfoTokens.bits = allowBits ? choiceInfoVotes.bits * 5 : 0;
      choiceInfoTokens.channel_points = allowPoints ? choiceInfoVotes.channel_points * 10 : 0;
      // add up all the base, bits and channel points botes
      obj.vote_total_base += choiceInfoVotes.base;
      obj.vote_total_bits += choiceInfoVotes.bits;
      obj.vote_total_points += choiceInfoVotes.channel_points;
    }
    choiceInfo.votes = choiceInfoVotes;
    choiceInfo.tokens = choiceInfoTokens;
    obj[`choice_${i + 1}_info`] = choiceInfo;
  }
  return obj;
}
