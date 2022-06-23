function YTLiveTestEvent(e) {
  class ConstructPullData {
    constructor() {
      [this.display_name, this.user_id, this.picture_url] = generateName();
      this.addvalues = (params) => {
        Object.assign(this, params);
      };
    }
  }

  const pullData = new ConstructPullData(e.id);

  switch (e.id) {
    default:
      break;
    case 'ytLiveTestSub':

      sendTriggerToLB(
        19,
        `YouTube Subscription Test triggered by ${pullData.display_name}`,
        {},
        pullData,
      );
      break;
    case 'ytLiveTestMember':

      pullData.addvalues({
        channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
        chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
        level_name: 'Some level name',
      });

      sendTriggerToLB(
        22,
        `YouTube Member Test triggered by ${pullData.display_name}`,
        {},
        pullData,
      );

      break;
    case 'ytLiveTestMilestone': {
      const months = document.getElementById('YTLiveMilestoneMonth').value || Math.ceil(Math.random() * 10);
      const level_name = document.getElementById('YTLiveMilestoneLevel').value || 'Some level name';
      const message = document.getElementById('YTLiveMilestoneMsg').value || generateMessage();

      pullData.addvalues({
        channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
        chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
        level_name,
        message,
        months,
      });

      sendTriggerToLB(
        22,
        `YouTube Member Renewal Test triggered by ${pullData.display_name}`,
        {},
        pullData,
      );
    }
      break;
    case 'ytLiveTestSuperChat': {
      const amount = parseInt(document.getElementById('YTLiveSuperChatAmount').value) || Math.ceil(Math.random() * 1000000);
      const tier = document.getElementById('YTLiveSuperChatTier').value || Math.ceil(Math.random() * 5);
      const message = document.getElementById('YTLiveSuperChatMsg').value || generateMessage();

      pullData.addvalues({
        channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
        chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
        amount,
        amount_as_string: `${amount}`,
        currency: 'USD',
        message,
        tier,
      });

      sendTriggerToLB(
        20,
        `YouTube Super Chat Test triggered by ${pullData.display_name}`,
        { amount },
        pullData,
      );
    }
      break;
    case 'ytLiveTestSuperSticker': {
      const amount = parseInt(document.getElementById('YTLiveSuperStickerAmount').value) || Math.ceil(Math.random() * 1000000);

      pullData.addvalues({
        channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
        chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
        amount,
        amount_as_string: `${amount}`,
        currency: 'USD',
        sticker_id: 'pearfect_hey_you_v2',
        sticker_text: 'Pear character turning around waving his hand, saying Hey you while lowering his glasses',
      });

      sendTriggerToLB(
        21,
        `YouTube Super Sticker Test triggered by ${pullData.display_name}`,
        { amount },
        pullData,
      );
    }
      break;
    case 'ytLiveTestChatMessage': {
      const message = document.getElementById('YTLiveChatMessageMsg').value || generateMessage();
      pullData.addvalues({
        display_name: document.getElementById('YTLiveChatMessageName').value || pullData.display_name,
        channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
        chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
        message: message.replace(/"/g, "'"),
        is_broadcaster: YTLiveChatMessageBroadcaster.checked,
        is_moderator: YTLiveChatMessageMod.checked,
        is_member: YTLiveChatMessageVerified.checked,
        is_verified: YTLiveChatMessageMember.checked,
      });

      sendTriggerToLB(
        18,
        `YouTube Chat Message Test triggered by ${pullData.display_name}`,
        {
          broadcaster: YTLiveChatMessageBroadcaster.checked,
          moderator: YTLiveChatMessageMod.checked,
          verified: YTLiveChatMessageVerified.checked,
          sponsor: YTLiveChatMessageMember.checked,
          message,
        },
        pullData,
      );
    }
      break;
  }

  function generateMessage() {
    const message = ['Hello World!', "Alright, I'll be honest with ya, Bob. My name's not Kirk. It's Skywalker. Luke Skywalker.", 'Well, that never happened in any of the simulations.', 'You know, you blow up one sun and suddenly everyone expects you to walk on water.', "How's a needle in my butt gonna get water out of my ears?", 'If you immediately know the candle light is fire, then the meal was cooked a long time ago.', "So it's possible there's an alternate version of myself out there that actually understands what the hell you're talkin' about?", 'It costs nearly a billion dollars just to turn the lights on around here'];
    const randomMsg = message[Math.floor(Math.random() * message.length)];
    return randomMsg;
  }

  function generateName() {
    const names = [
      ['RoadieGamer', 'UCvuULk4cLyoXHuraLDUkEpA', 'https://yt3.ggpht.com/9Mg_T4R3Po1LMKod4RcLL82x6NiZj4xFt1ztuX6hmJhvp_gAlSmExejepwLuH2V7Wj8klJbG=s88-c-k-c0x00ffffff-no-rj'],
      ['SilverLink', 'UCnXFNHXAmerjr5RLvlX4ojw', 'https://yt3.ggpht.com/96qVz0pLVJHB5NVCYdjLYAWNvcEl4zXH9UukPh3F_gv2a7aTdkIg6SQ2-L4fLGnSXhz_WN5GvA=s88-c-k-c0x00ffffff-no-rj'],
      ['Rams Reef', 'UCeSb7sLzpb7OVVzGe07AcHA', 'https://yt3.ggpht.com/ytc/AKedOLRpXf-yfyFyrfOJ9rdrCDDSR6PbMDgn1v0fs912=s88-c-k-c0x00ffffff-no-rj'],
      ['Cyanidesugar', 'UCnifImIxwoE9BalbaWlRuVg', 'https://yt3.ggpht.com/ytc/AKedOLRqNadDTDkEa-Nlz8UCNVvxK9hykksk1XVXhjgD=s88-c-k-c0x00ffffff-no-rj'],
      ['Wolbee', 'UC6e9OkB4njOHdN7jn9QYNRg', 'https://yt3.ggpht.com/_LK_RuWL5-mx2rK8foKYfNmpFlCRjkgbDChTUoxBf8xDwh9hgDqDDT5mmKJ-risI4qjIuYTe3w=s88-c-k-c0x00ffffff-no-rj'],
      ['chrizzz_1508', 'UCgs5H0txAV59us-H_xaysFw', 'https://yt3.ggpht.com/dMFvS0Z4jqWi9nuHW_Oin7xTwITC0pog7XJ9aIH7XKKkk4OjoBw_EH1J_iGy4X67X52A58gypQ=s88-c-k-c0x00ffffff-no-rj'],
      ['Mr.Rubber Ducky', 'UCM-wHpDJhBXQXO4Pq4SnusA', 'https://yt3.ggpht.com/q5SJkgteZVlcNNZQLUvCb5kirAEMkZPK2ADMeEY5sc97PpGngkx-mHiNOb9_bRyv46QKkIE_5w=s88-c-k-c0x00ffffff-no-rj'],
      ['Falinere', 'UCDf53fZZjoMIq-T0yOxEAIA', 'https://yt3.ggpht.com/ytc/AKedOLSC7rJLJF4kHQYguvZA37NLrVgGb_OQAJb6uCBkIQ=s88-c-k-c0x00ffffff-no-rj'],
      ['Waldo & Friends', 'UCwxgRi2IFqlYVTneamjrESA', 'https://yt3.ggpht.com/ytc/AKedOLQDlThoavf6_zR7WmRUM4GB0Bg_t8QpJ2jbEi8D=s88-c-k-c0x00ffffff-no-rj'],
      ['Landie', 'UC1FayVR82EazSlBS37sosrw', 'https://yt3.ggpht.com/ytc/AKedOLTgoUIiOsrTEEsGJEXgyQ1MkXmVOFrOjnUARQc_iw=s88-c-k-c0x00ffffff-no-rj'],
      ['Flipstream', 'UCEKVFoETu3cCBjqV8v4Z6uQ', 'https://yt3.ggpht.com/ScwqNhrC8CSzp3J6Nr2rGgFupPa4BrN3Kuq3gUJkYtqJxTbXPYv0alhk8qlaIa6oUOCGoDvo=s88-c-k-c0x00ffffff-no-rj'],
      ['griddark', 'UCn9zd0-RuMBZKE7u_myGtgA', 'https://yt3.ggpht.com/ytc/AKedOLSoo-kdU6msTEX46Wn7Q_TxGgzYgaO1hsvCzydz5Q=s88-c-k-c0x00ffffff-no-rj'],
      ['JimmyPotatoTV', 'UClxlbZo0-zHZcBIMOr4M4cQ', 'https://yt3.ggpht.com/ytc/AKedOLQVW4K8CXv4e_vDORLji4_2avIgYQ9FQkRpuXcv=s88-c-k-c0x00ffffff-no-rj'],
      ['Lyfesaver', 'UCqrv6kYkEfA2Rw_XGI3klWg', 'https://yt3.ggpht.com/ytc/AKedOLR5iCHlcCIkUSfcf-j4HcgV-Mh3V5rb3E7PfQae=s88-c-k-c0x00ffffff-no-rj'],
      ['MisterK', 'UCQFLW-RwDB7y4KE55Kqnsyg', 'https://yt3.ggpht.com/WHMcGQDTARCDKQyfIK4-K7Pm5xYVpp29A9D7qjIK9HQW1qDmNvHzc1Gk742FuVqCfYnbIn2Gjw=s88-c-k-c0x00ffffff-no-rj'],
      ['Sebas', 'UCQxIfBhgKD7YN2Gp8txd8GA', 'https://yt3.ggpht.com/ytc/AKedOLS6O3rx4NMuVngFSN_5mktw5LyT424zsS_jQIWd=s88-c-k-c0x00ffffff-no-rj'],
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    return randomName;
  }

  function generateMessage() {
    const messages = [
      'Hello World!',
      "Alright, I'll be honest with ya, Bob. My name's not Kirk. It's Skywalker. Luke Skywalker.",
      'Well, that never happened in any of the simulations.',
      'You know, you blow up one sun and suddenly everyone expects you to walk on water.',
      "How's a needle in my butt gonna get water out of my ears?",
      'If you immediately know the candle light is fire, then the meal was cooked a long time ago.',
      'In the middle of my backswing!?',
      'If I am to remain in this body, I must shave my head.',
      "I remembered something. There's a man. He is bald and wears a short sleeve shirt. And somehow, he is important to me… I think his name is… Homer.",
      'Alright, we came here in peace, we expect to go in one... piece.',
      'It costs nearly a billion dollars just to turn the lights on around here',
      "You wouldn't believe the things you can make from the common, simple items lying around your planet... which reminds me, you're going to need a new microwave.",
      'Welcome, ye knights of the round table, men of honor, followers of the path of righteousness. Only those with wealth of knowledge and truth of spirit shall be given access to the underworld, the storehouse of riches of Ambrosius Aurelianus. Prove ye worthy, and all shall be revealed.',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    return randomMessage;
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
