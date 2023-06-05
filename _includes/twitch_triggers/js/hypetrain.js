async SAMMITestTwitchHypeTrain(form) {
    const hypeSelect = form.elements['hypeTrainType'];
    const type = hypeSelect.options[hypeSelect.selectedIndex].text;
    const currentLevel = form.elements['hypeTrainLevel'].value || 1;
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
        const sourceSelect = form.elements['hypeTrainSource'];
        const source = sourceSelect.options[sourceSelect.selectedIndex].text;
        const [name, userID] = await getNameFromInput(form.elements.hypeTrainName);
        const amount = parseInt(form.elements['hypeTrainAmount'].value) || 10;
        data = {
          sequence_id: 2174,
          user_profile_image_url: 'https://static-cdn.jtvnw.net/custom-reward-images/default-4.png',
          user_id: userID,
          user_display_name: name,
          user_login: name.toLowerCase(),
          source,
          progress,
          is_boost_train: 0,
          quantity: amount || 10,
        };
      }
        break;
      case 'Updated': {
        const [name, userID] = await getNameFromInput(form.elements.hypeTrainName);
        const sourceSelect = form.elements['hypeTrainSource'];
        const source = sourceSelect.options[sourceSelect.selectedIndex].text;
        const particType = source === 'BITS' ? particTypes[getRandomInt(0, 2)] : particTypes[getRandomInt(3, 8)];
        const particTypeValue = parseInt(form.elements['hypeTrainAmount'].value) || 10;
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
        const reasonSelect = form.elements['hypeTrainEndReason'];
        const reason = reasonSelect.options[reasonSelect.selectedIndex].text;
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
      `Hype Train ${type} [test trigger] fired!`,
      { type: typeNum },
      baseObj,
    );
  }