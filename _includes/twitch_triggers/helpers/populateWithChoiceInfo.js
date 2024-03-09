function populateWithChoiceInfo(obj, amount, type, allowBits, allowPoints, voteTotal) {
  // Initialize the choice votes split array
  const choiceVotesSplit = new Array(amount).fill(0);

  let remainingVotes = voteTotal;
  for (let i = 0; i < amount; i++) {
    if (i === amount - 1) {
      choiceVotesSplit[i] = remainingVotes;
    } else {
      const part = voteTotal > 0 ? getRandomInt(1, remainingVotes - (amount - i - 1)) : 0;
      choiceVotesSplit[i] = part;
      remainingVotes -= part;
    }
  }

  // Calculate the top votes sorted array
  const voteWithIndex = choiceVotesSplit.map((votes, index) => ({ votes, index }));
  voteWithIndex.sort((a, b) => b.votes - a.votes);
  const topVotesSorted = voteWithIndex.map(item => item.index);
  obj.top_vote_list = topVotesSorted;

  for (let i = 0; i < amount; i++) {
    const choiceVotes = choiceVotesSplit[i];
    const choiceInfo = {
      choice_id: `ddb2f066-1e36-4099-a71b-50621f90b${i}cd`,
      title: `Test Choice ${i + 1}`,
      percentage: type !== 'Created' && choiceVotes !== 0 ? parseInt((choiceVotes / voteTotal) * 100) : 0,
      total_voters: type !== 'Created' && choiceVotes !== 0 ? getRandomInt(Math.ceil(choiceVotes / 10), choiceVotes) : 0,
      votes: {
        total: choiceVotes,
        base: 0,
        bits: 0,
        channel_points: 0
      },
      tokens: {
        bits: 0,
        channel_points: 0
      }
    };

    if (type !== 'Created' && choiceVotes !== 0) {
      const splitFactors = allowBits && allowPoints ? 3 : allowBits || allowPoints ? 2 : 1;
      let splitVotes = new Array(splitFactors).fill(0);
      for (let j = 0; j < splitFactors; j++) {
        splitVotes[j] = j === splitFactors - 1 ? choiceVotes : getRandomInt(1, choiceVotes);
      }

      choiceInfo.votes.base = splitVotes[0];
      choiceInfo.votes.bits = allowBits ? splitVotes[1] : 0;
      choiceInfo.votes.channel_points = allowPoints ? splitVotes[2] || splitVotes[1] : 0;

      choiceInfo.tokens.bits = allowBits ? choiceInfo.votes.bits * 5 : 0;
      choiceInfo.tokens.channel_points = allowPoints ? choiceInfo.votes.channel_points * 10 : 0;

      obj.vote_total_base += choiceInfo.votes.base;
      obj.vote_total_bits += choiceInfo.votes.bits;
      obj.vote_total_points += choiceInfo.votes.channel_points;
    }

    obj[`choice_${i + 1}_info`] = choiceInfo;
  }

  return obj;
}
