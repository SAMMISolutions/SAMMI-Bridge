// Fake Triggers testing
function LBTestTriggers() {
  const processTrigger = {
    LBTestTwitchSubs(form, notUsed, gifted = false, gifterName = '') {
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
          ? 'Anonymous User'
          : generateName();
      const giftedName = subtype !== 1 ? generateName(name) : '';
      const message = form.submessage.value || generateMessage();
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
        ? `${name} gifted a sub to ${giftedName}!`
        : `${name} subscribed for ${month} months!`;
      const data = {
        tier: selecterTierNum,
        month,
        subtype,
        communitygift: gifted ? 1 : 0,
      };
      const pullData = {
        user_name: name.toLowerCase(),
        display_name: name,
        user_id: 123456789,
        gifted_user_name: giftedName.toLowerCase(),
        gifted_display_name: giftedName,
        gifted_user_id: 123456789,
        tier: selectedTier,
        context,
        message,
        month,
        community_gift: gifted ? 1 : 0,
      };
      sendTriggerToLB(type, msg, data, pullData);
    },

    LBTestTwitchSubGift(form) {
      const subForm = document.getElementById('LBTestTwitchSubs');
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
        ? 'Anonymous User'
        : generateName();
      const amount = parseInt(form.subGiftAmount.value) || 1;
      const pullData = {
        user_name: gifterName.toLowerCase(),
        display_name: gifterName,
        user_id: 123456789,
        amount,
        tier: selectedTier,
      };
      sendTriggerToLB(
        2,
        `${gifterName} has gifted ${amount} subs!`,
        {
          tier: selecterTierNum,
          amount,
        },
        pullData,
      );

      for (let i = 0; i < amount; i++) {
        setTimeout(() => {
          this.LBTestTwitchSubs(subForm, null, true, gifterName);
        }, 1000 + i * 10);
      }
    },

    LBTestTwitchBits(form, pullData) {
      const amount = parseInt(form.bitsamount.value) || 50;
      const totalAmount = parseInt(form.bitstotal.value) || amount + 100;
      const message = form.bitsmessage.value || generateMessage();
      pullData.addvalues({
        amount,
        total_amount: totalAmount,
        message,
      });
      sendTriggerToLB(
        5,
        `${pullData.user_name} donated ${amount} bits!`,
        {
          amount,
        },
        pullData,
      );
    },

    LBTestTwitchPoints(form, pullData) {
      const channelID = Math.floor(Math.random() * 1000000000);
      const redeemName = form.channelPointsName.value || 'Test Reward';
      const userInput = form.channelPointsInput.checked;
      const message = userInput
        ? form.channelPointsMsg.value || generateMessage()
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
      sendTriggerToLB(
        3,
        `${pullData.display_name} has redeemed ${redeemName}!`,
        {
          redeemname: redeemName,
          message,
        },
        pullData,
      );
    },

    LBTestTwitchRaid(form, pullData) {
      const amount = parseInt(form.raidAmount.value) || 5;
      pullData.addvalues({
        amount,
      });
      sendTriggerToLB(
        4,
        `${pullData.display_name} is raiding you with ${amount} viewers!`,
        {
          amount,
        },
        pullData,
      );
    },

    LBTestTwitchHost(form, pullData) {
      const amount = parseInt(form.hostamount.value) || 5;
      pullData.addvalues({
        amount,
      });
      sendTriggerToLB(
        14,
        `${pullData.display_name} is hosting you with ${amount} viewers!`,
        {
          amount,
        },
        pullData,
      );
    },

    LBTestTwitchChat(form) {
      const name = form.chatName.value || generateName();
      const userId = Math.floor(Math.random() * 1000000000);
      const message = form.chatMsg.value || generateMessage();
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
        user_id: userId,
        message,
        emote_list: emoteList,
        badge_list: badge,
        channel,
        name_color: color,
        first_time: firstTime,
      };
      LB.trigger(0, {
        message,
        broadcaster: form.chatBroadcaster.checked,
        moderator: form.chatMod.checked,
        sub: form.chatSub.checked,
        vip: form.chatVip.checked,
        founder: form.chatFounder.checked,
        trigger_data: pullData,
      });
    },

    LBTestTwitchFollow(form, pullData) {
      sendTriggerToLB(
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
      this.user_name = type !== 'LBTestTwitchHost' ? name.toLowerCase() : undefined;
      this.display_name = type !== 'LBTestTwitchBits' ? name : undefined;
      this.user_id = type !== 'LBTestTwitchHost'
        ? Math.floor(Math.random() * 1000000000)
        : undefined;

      this.addvalues = (params) => {
        Object.assign(this, params);
      };
    }
  }

  const forms = document.querySelectorAll('.LBTestTriggers');
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

  function generateName(name = '') {
    const names = [
      'Melonax',
      'RamsReef',
      'Wellzish',
      'Andilippi',
      'Cyanidesugar',
      'Silverlink',
      'wolbee',
      'Davidihewlett',
      'DearAsMax',
      'Estudiando_Ajedrez',
      'RoadieGamer',
      'chrizzz_1508',
      'MisterK_Qc',
      'Falinere',
      'Landie',
      'Phat32',
      'mofalkmusic',
      'NikiYanagi',
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    if (name !== randomName) return randomName;
    return generateName(name);
  }

  function generateMessage() {
    const messages = [
      'Hello World!',
      "Love your stream, you are a very genuine guy and you're not affraid to say it how it is. But, I would just prefer if you didn't give your opinion, just saying.",
      "Alright, I'll be honest with ya, Bob. My name's not Kirk. It's Skywalker. Luke Skywalker.",
      'Well, that never happened in any of the simulations.',
      'You know, you blow up one sun and suddenly everyone expects you to walk on water.',
      "How's a needle in my butt gonna get water out of my ears?",
      'If you immediately know the candle light is fire, then the meal was cooked a long time ago.',
      'All that glitters is not gold. Fair is foul, and foul is fair Hover through the fog and filthy air. These violent delights have violent ends. Hell is empty and all the devils are here. By the pricking of my thumbs, Something wicked this way comes. Open, locks, Whoever knocks!',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    return randomMessage;
  }

  function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (
      c
        ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16));
  }

  function sendTriggerToLB(
    type,
    message = 'Test trigger fired.',
    data = {},
    triggerData,
  ) {
    data.trigger_data = triggerData;
    LB.trigger(type, data);
    LB.alert(message);
  }
}
