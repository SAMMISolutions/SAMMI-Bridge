// Fake Triggers testing
async function SAMMITestTriggers() {
  const processTrigger = {
    SAMMITestTwitchSubs(form, notUsed, gifted = false, gifterName = '') {
      const type = 1;
      const subtype = form.subgift.checked
        ? 2
        : form.anongift.checked
          ? 4
          : gifted
            ? 2
            : 1;
      const context = form.subgift.checked
        ? 'subgift'
        : form.anongift.checked
          ? 'anonsubgift'
          : gifted
            ? 'subgift'
            : 'resub';
      const month = parseInt(form.submonths.value) || 1;
      const name = gifted
        ? gifterName
        : form.anongift.checked
          ? ['Anonymous User']
          : generateName();
      const giftedName = subtype !== 1 ? generateName(name[0]) : [''];
      const message = form.submessage.value || SAMMI.generateMessage();
      const tiers = form.querySelectorAll('input[name="tier"]');
      let selectedTier;
      let selectedTierD;

      for (const tier of tiers) {
        if (tier.checked) {
          selectedTier = tier.value;
        }
      }

      const selecterTierNum = selectedTier === 'Tier 1'
        ? 1
        : selectedTier === 'Tier 2'
          ? 2
          : selectedTier === 'Tier 3'
            ? 4
            : 8;
      const msg = subtype !== 1
        ? `${name[0]} gifted a sub to ${giftedName[0]} (test trigger)!`
        : `${name[0]} subscribed for ${month} months! (test trigger)`;
      const data = {
        tier: selecterTierNum,
        month,
        subtype,
        communitygift: gifted ? 1 : 0,
      };
      const pullData = {
        user_name: name[0].toLowerCase(),
        display_name: name[0],
        user_id: name[1],
        gifted_user_name: giftedName[0].toLowerCase(),
        gifted_display_name: giftedName[0],
        gifted_user_id: giftedName[1],
        tier: selectedTier,
        context,
        message,
        month,
        community_gift: gifted ? 1 : 0,
      };
      sendTriggerToSAMMI(type, msg, data, pullData);
    },

    SAMMITestTwitchSubGift(form) {
      const subForm = document.getElementById('SAMMITestTwitchSubs');
      if (subForm.prime.checked) subForm.tier1.checked = true;
      if (subForm.anongift.checked === false) subForm.subgift.checked = true;
      const tiers = subForm.querySelectorAll('input[name="tier"]');
      let selectedTier;

      for (const tier of tiers) {
        if (tier.checked) {
          selectedTier = tier.value;
        }
      }

      const selecterTierNum = selectedTier === 'Tier 1'
        ? 1
        : selectedTier === 'Tier 2'
          ? 2
          : selectedTier === 'Tier 3'
            ? 4
            : 1;
      const gifterName = subForm.anongift.checked
        ? ['Anonymous User']
        : generateName();
      const amount = parseInt(form.subGiftAmount.value) || 1;
      const pullData = {
        user_name: gifterName[0].toLowerCase(),
        display_name: gifterName[0],
        user_id: gifterName[1],
        amount,
        tier: selectedTier,
      };
      sendTriggerToSAMMI(
        2,
        `${gifterName[0]} has gifted ${amount} subs!`,
        {
          tier: selecterTierNum,
          amount,
        },
        pullData,
      );

      for (let i = 0; i < amount; i++) {
        setTimeout(() => {
          this.SAMMITestTwitchSubs(subForm, null, true, gifterName);
        }, 1000 + i * 10);
      }
    },

    SAMMITestTwitchBits(form, pullData) {
      const amount = parseInt(form.bitsamount.value) || 50;
      const totalAmount = parseInt(form.bitstotal.value) || amount + 100;
      const message = form.bitsmessage.value || SAMMI.generateMessage();
      pullData.addvalues({
        amount,
        total_amount: totalAmount,
        message,
      });
      sendTriggerToSAMMI(
        5,
        `${pullData.user_name} donated ${amount} bits (test trigger)!`,
        {
          amount,
        },
        pullData,
      );
    },

    SAMMITestTwitchPoints(form, pullData) {
      const channelID = generateName[1];
      const redeemName = form.channelPointsName.value || 'Test Reward';
      const userInput = form.channelPointsInput.checked;
      const message = userInput
        ? form.channelPointsMsg.value || SAMMI.generateMessage()
        : '';
      const cost = parseInt(form.channelPointsCost.value) || 50;
      const image = 'https://static-cdn.jtvnw.net/custom-reward-images/default-4.png';
      const rewardId = generateUUID();
      const redeemId = generateUUID();
      pullData.addvalues({
        channel_id: channelID,
        redeem_name: redeemName,
        message,
        cost,
        image,
        reward_id: rewardId,
        redeem_id: redeemId,
      });
      sendTriggerToSAMMI(
        3,
        `${pullData.display_name} has redeemed ${redeemName}!`,
        {
          redeemname: redeemName,
          message,
          user_name: pullData.user_name,
        },
        pullData,
      );
    },

    SAMMITestTwitchRaid(form, pullData) {
      const amount = parseInt(form.raidAmount.value) || 5;
      pullData.addvalues({
        amount,
      });
      sendTriggerToSAMMI(
        4,
        `${pullData.display_name} is raiding you with ${amount} viewers (test trigger)!`,
        {
          amount,
        },
        pullData,
      );
    },

    SAMMITestTwitchHost(form, pullData) {
      const amount = parseInt(form.hostamount.value) || 5;
      pullData.addvalues({
        amount,
      });
      sendTriggerToSAMMI(
        14,
        `${pullData.display_name} is hosting you with ${amount} viewers (test trigger)!`,
        {
          amount,
        },
        pullData,
      );
    },

    SAMMITestTwitchPrediction(form) {
      const predictSelect = form.predictType;
      const amount = form.predictChoiceAmount.value || getRandomInt(2, 10);
      const duration = form.predictionDuration.value || getRandomInt(60, 600);
      const type = predictSelect[predictSelect.selectedIndex].text || 'Created';
      const typeNum = type === 'Created' ? 0 : type === 'Voted' ? 1 : type === 'Locked' ? 2 : 3;
      const baseData = {
        duration: parseInt(duration),
        outcome_amount: parseInt(amount),
        vote_total: type !== 'Created' ? getRandomInt(10, 300) : 0,
        event: type,
        prediction_id: '1621385a-1f26-4197-82fc-6352003a69db',
        prediction_name: 'My Test Prediction',
        winning_outcome: type === 'Resolved' ? `e960f614-d379-494a-8b45-0c7500978${getRandomInt(0, amount - 1)}ea` : '',
      };
      const pullData = populateWithOutcomeInfo(baseData, amount, type);

      sendTriggerToSAMMI(
        15,
        `Prediction ${type} Test trigger sent!`,
        {
          type: typeNum,
        },
        pullData,
      );
    },

    SAMMITestTwitchPoll(form) {
      const pollSelect = form.pollType;
      const amount = form.pollChoiceAmount.value || getRandomInt(2, 5);
      const duration = form.pollDuration.value || getRandomInt(60, 600);
      const type = pollSelect[pollSelect.selectedIndex].text || 'Created';
      const typeNum = type === 'Created' ? 0 : type === 'Voted' ? 1 : type === 'Ended' ? 2 : 3;
      const allowBits = !!pollAllowBits.checked;
      const allowPoints = !!pollAllowPoints.checked;
      // total votes is 0 if the poll was just Created, else get random amount based on choices amount
      const voteTotal = (type !== 'Created') ? getRandomInt(amount, amount * 50) : 0;
      const baseData = {
        duration: parseInt(duration),
        event: type,
        poll_id: '9dd6a7a7-78f4-46ef-b674-e2864ad7fa07',
        poll_name: 'My Test Poll',
        choice_amount: parseInt(amount),
        vote_total: voteTotal,
        vote_total_base: 0,
        vote_total_bits: 0,
        vote_total_points: 0,
        top_vote_list: Array.from(Array(amount).keys()),
      };
      const pullData = populateWithChoiceInfo(baseData, amount, type, allowBits, allowPoints, voteTotal);

      sendTriggerToSAMMI(
        16,
        `Poll ${type} Test trigger sent!`,
        {
          type: typeNum,
        },
        pullData,
      );
    },
    async SAMMITestTwitchHypeTrain(form) {
      const hypeSelect = form.hypeTrainType;
      const type = hypeSelect[hypeSelect.selectedIndex].text;
      const currentLevel = form.hypeTrainLevel.value || 1;
      const currentGoal = getRandomInt(1000, 2000);
      const goalProgres = getRandomInt(100, currentGoal - 50);
      const typeNums = {
        Approaching: 0, Started: 1, Updated: 2, 'Leveled Up': 3, Ended: 4, 'Cooldown Expired': 5, Progressed: 6,
      };
      const typeNum = typeNums[type];
      let baseObj = {};
      // base SAMMI trigger values are the same for the following types
      if (typeNum == 1 || typeNum == 3 || typeNum == 6) {
        baseObj = {
          current_level: parseInt(currentLevel),
          current_goal: currentGoal,
          goal_progress: goalProgres,
          total_progress: goalProgres,

        };
      }

      const hypeTrainId = `${getRandomInt(10, 99)}b8f628-5075-4213-95ac-6ceeac9426fe`;

      // this reward object is added to approaching events
      // not sure if it changes depending on the broadcaster
      const level_one_rewards = [{
        id: 'emotesv2_3114c3d12dc44f53810140f632128b54',
        reward_level: 0.0,
        group_id: '',
        token: 'HypeSleep',
        type: 'EMOTE',
        set_id: '1a8f0108-5aee-4125-8067-d39e983e934b',
      }, {
        id: 'emotesv2_7d457ecda087479f98501f80e23b5a04',
        reward_level: 0.0,
        group_id: 1,
        token: 'HypePat',
        type: 'EMOTE',
        set_id: '1a8f0108-5aee-4125-8067-d39e983e934b',
      }, {
        id: 'emotesv2_e7a6e7e24a844e709c4d93c0845422e1',
        reward_level: 0.0,
        group_id: '',
        token: 'HypeLUL',
        type: 'EMOTE',
        set_id: '1a8f0108-5aee-4125-8067-d39e983e934b',
      }, {
        id: 'emotesv2_e2a11d74a4824cbf9a8b28079e5e67dd',
        reward_level: 0.0,
        group_id: '',
        token: 'HypeCool',
        type: 'EMOTE',
        set_id: '1a8f0108-5aee-4125-8067-d39e983e934b',
      }, {
        id: 'emotesv2_036fd741be4141198999b2ca4300668e',
        reward_level: 0.0,
        group_id: '',
        token: 'HypeLove1',
        type: 'EMOTE',
        set_id: '1a8f0108-5aee-4125-8067-d39e983e934b',
      }];

      const progress = {
        remaining_seconds: typeNum !== 1 ? getRandomInt(10, 299) : 299,
        total: goalProgres,
        value: goalProgres,
        goal: currentGoal,
        level: {
          impressions: getRandomInt(100, 900),
          rewards: level_one_rewards,
          value: parseInt(currentLevel),
          goal: currentGoal,
        },
      };

      // types of all participations
      const particTypes = ['BITS.CHEER', 'BITS.EXTENSION', 'BITS.POLL', 'SUBS.TIER_2_SUB', 'SUBS.TIER_2_GIFTED_SUB', 'SUBS.TIER_1_GIFTED_SUB', 'SUBS.TIER_1_SUB', 'SUBS.TIER_3_SUB', 'SUBS.TIER_3_GIFTED_SUB'];
      let data;

      switch (type) {
        default:
          data = {};
          break;
        case 'Approaching': {
          // participants is an array of user IDs
          const participants = Array(getRandomInt(2, 10)).fill(generateName()[1]);
          data = {
            approaching_hype_train_id: hypeTrainId,
            channel_id: generateName()[1],
            goal: 3,
            is_boost_train: 0,
            participants,
            level_one_rewards,
            creator_color: '639315',
            // array of one single value? can it be more? probably..
            events_remaining_durations: [getRandomInt(50, 300)],
          };
        }
          break;
        case 'Started': {
          // started and updated at will be the same
          const started = Date.now();
          data = {
            id: hypeTrainId,
            channel_id: generateName()[1],
            started_at: started,
            updated_at: started,
            expires_at: started + 300000,
            ended_at: null,
            ending_reason: null,
            participations: {
              // get two random participation types and generate their values
              [particTypes[getRandomInt(0, 2)]]: getRandomInt(1, 1000),
              [particTypes[getRandomInt(3, 8)]]: getRandomInt(1, 10),
            },
            conductors: {},
            // this is supposed to return very long complex object, leaving blank for tests
            config: {},
            progress,
            is_boost_train: 0,
          };
        }
          break;
        case 'Progressed': {
          const sourceSelect = form.hypeTrainSource;
          const source = sourceSelect[sourceSelect.selectedIndex].text;
          const [name, userID] = await getNameFromInput(form.hypeTrainName);
          data = {
            sequence_id: 2174,
            user_profile_image_url: 'https://static-cdn.jtvnw.net/custom-reward-images/default-4.png',
            user_id: userID,
            user_display_name: name,
            user_login: name.toLowerCase(),
            source,
            progress,
            is_boost_train: 0,
            quantity: parseInt(form.hypeTrainAmount.value) || 10,
          };
        }
          break;
        case 'Updated': {
          const [name, userID] = await getNameFromInput(form.hypeTrainName);
          const sourceSelect = form.hypeTrainSource;
          const source = sourceSelect[sourceSelect.selectedIndex].text;
          const particType = source === 'BITS' ? particTypes[getRandomInt(0, 2)] : particTypes[getRandomInt(3, 8)];
          const particTypeValue = parseInt(form.hypeTrainAmount.value) || 10;
          baseObj = {
            display_name: name,
            user_name: name.toLowerCase(),
            user_id: userID,
          };
          data = {
            participations: {
              [particType]: particTypeValue,
            },
            source,
            user: {
              profile_image_url: 'https://static-cdn.jtvnw.net/custom-reward-images/default-4.png',
              id: userID,
              display_name: name,
              login: name.toLowerCase(),
            },
          };
        }
          break;
        case 'Leveled Up':
          data = {
            progress,
            time_to_expire: Date.now() + getRandomInt(10000, 300000),
            is_boost_train: 0,
          };
          break;
        case 'Ended': {
          const reasonSelect = form.hypeTrainEndReason;
          const reason = reasonSelect[reasonSelect.selectedIndex].text;
          baseObj = {
            ending_reason: reason,
          };
          data = {
            ending_reason: reason,
            ended_at: Date.now(),
            is_boost_train: 0,
          };
        }
          break;
        case 'Cooldown Expired': {
          // not sure what Pubsub sends for this event
          data = {};
        }
      }

      baseObj.type = typeNum;
      baseObj.data = data;

      sendTriggerToSAMMI(
        17,
        `Hype Train ${type} Test trigger sent!`,
        { type: typeNum },
        baseObj,
      );
    },

    async SAMMITestTwitchChat(form) {
      const [name, userID] = await getNameFromInput(form.chatName);
      const message = form.chatMsg.value || SAMMI.generateMessage();
      const channel = Math.floor(Math.random() * 1000000000);
      const color = '#189A8D';
      const emoteList = '304822798:0-9/304682444:11-19';
      const firstTime = form.chatFirstTime.checked;
      const badge = [];
      if (form.chatBroadcaster.checked) badge.push('broadcaster/1');
      if (form.chatMod.checked) badge.push('moderator/1');
      if (form.chatVip.checked) badge.push('vip/1');
      if (form.chatFounder.checked) badge.push('founder/1');
      if (form.chatSub.checked) {
        const tier = parseInt(form.chatMsgSubTier.value);
        let month = form.chatMsgSubMonth.value != 1
          ? parseInt(form.chatMsgSubMonth.value)
          : 0;
        month = month > 3 && month < 6
          ? (month = 3)
          : month > 6 && month < 9
            ? (month = 6)
            : month > 9 && month < 12
              ? (month = 9)
              : month;
        const subBadge = tier === 1
          ? `subscriber/${month}`
          : tier === 2
            ? `subscriber/${2000 + month}`
            : `subscriber/${3000 + month}`;
        badge.push(subBadge);
      }

      const pullData = {
        user_name: name.toLowerCase(),
        display_name: name,
        user_id: parseInt(userID),
        message,
        emote_list: emoteList,
        badge_list: badge.join(','),
        channel,
        name_color: color,
        first_time: firstTime,
      };
      SAMMI.trigger(0, {
        message,
        user_name: name.toLowerCase(),
        broadcaster: form.chatBroadcaster.checked,
        moderator: form.chatMod.checked,
        sub: form.chatSub.checked,
        vip: form.chatVip.checked,
        founder: form.chatFounder.checked,
        trigger_data: pullData,
      });
    },

    SAMMITestTwitchFollow(form, pullData) {
      sendTriggerToSAMMI(
        6,
        `${pullData.display_name} followed you!`,
        {},
        pullData,
      );
    },
  };

  class ConstructPullData {
    constructor(type) {
      const name = generateName();
      this.user_name = type !== 'SAMMITestTwitchHost' ? name[0].toLowerCase() : undefined;
      this.display_name = type !== 'SAMMITestTwitchBits' ? name[0] : undefined;
      this.user_id = type !== 'SAMMITestTwitchHost'
        ? name[1]
        : undefined;

      this.addvalues = (params) => {
        Object.assign(this, params);
      };
    }
  }

  const forms = document.querySelectorAll('.SAMMITestTriggers');
  Array.prototype.slice.call(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (e) => {
        e.preventDefault();
        const pullData = new ConstructPullData(form.id);
        processTrigger[form.id](form, pullData);
      },
      false,
    );
  });

  async function getNameFromInput(input) {
    let name; let userID;
    if (input.value.length > 0) {
      name = input.value;
      userID = await getUserID(name)
        .catch((e) => name = e);
    } else {
      [name, userID] = generateName();
    }
    return [name, userID];
  }

  async function getUserID(username) {
    const defaultID = 76159058;
    const response = await fetch(`https://decapi.me/twitch/id/${username}`)
      .catch(() => { throw defaultID; });
    const tryToGetID = await response.text();
    if (tryToGetID.indexOf('User not found') === -1) return tryToGetID;
    return defaultID;
  }

  function generateName(name = '') {
    const names = [
      ['Melonax', 41809329],
      ['RamsReef', 91464575],
      ['Wellzish', 461898318],
      ['Andilippi', 47504449],
      ['Cyanidesugar', 76159058],
      ['Silverlink', 489730],
      ['wolbee', 72573038],
      ['Davidihewlett', 116807809],
      ['DearAsMax', 478335805],
      ['Estudiando_Ajedrez', 184806573],
      ['RoadieGamer', 450427842],
      ['chrizzz_1508', 88246295],
      ['MisterK_Qc', 475765680],
      ['Falinere', 144606537],
      ['Landie', 78949799],
      ['Phat32', 24565497],
      ['mofalkmusic', 443568234],
      ['NikiYanagi', 528140333],
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    if (name !== randomName) return randomName;
    return generateName(name);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
  }

  // split a total amount into several parts
  function* splitNParts(num, parts) {
    let sumParts = 0;
    for (let i = 0; i < parts - 1; i++) {
      const pn = Math.ceil(Math.random() * (num - sumParts));
      yield pn;
      sumParts += pn;
    }
    yield num - sumParts;
  }

  function populateWithChoiceInfo(obj, amount, type, allowBits, allowPoints, voteTotal) {
    // split total votes into parts for each choice
    const choiceVotesSplit = [...splitNParts(voteTotal, amount)];
    const topVotes = { ...choiceVotesSplit };
    const topVotesSorted = Object.keys(topVotes).sort((a, b) => parseInt(topVotes[b]) - parseInt(topVotes[a]));
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

  function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (
      c
        ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16));
  }

  function sendTriggerToSAMMI(
    type,
    message = 'Test trigger fired.',
    data = {},
    triggerData,
  ) {
    data.trigger_data = triggerData;
    SAMMI.testTrigger(type, data);
    SAMMI.alert(message);
  }
}
