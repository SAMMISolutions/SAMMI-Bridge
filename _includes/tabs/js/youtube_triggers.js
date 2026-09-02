function YTLiveTestEvent() {
  class ConstructPullData {
    constructor(id) {
      [this.display_name, this.user_id, this.picture_url] = generateName();
      this.addvalues = (params) => {
        Object.assign(this, params);
      };
      this.id = id;
    }
  }

  const buttonIds = [
    'ytLiveTestSub',
    'ytLiveTestMember',
    'ytLiveTestMilestone',
    'ytLiveTestSuperChat',
    'ytLiveTestSuperSticker',
    'ytLiveTestChatMessage',
    'ytLiveTestJewels',
    'ytLiveTestMembershipGiftSent',
    'ytLiveTestMembershipGiftReceived',
    'ytLiveTestMembersOnlyChatStarted',
    'ytLiveTestMembersOnlyChatEnded',
    'ytLiveTestUserBanned',
    'ytLiveTestPollStarted',
    'ytLiveTestPollClosed'
  ];

  buttonIds.forEach(id => {
    const button = document.getElementById(id);
    const pullData = new ConstructPullData(id);

    button.addEventListener('click', () => {
      switch (pullData.id) {
        case 'ytLiveTestSub': ytLiveTestSub(pullData)
          break;
        case 'ytLiveTestMember': ytLiveTestMember(pullData)
          break;
        case 'ytLiveTestMilestone': ytLiveTestMilestone(pullData)
          break;
        case 'ytLiveTestSuperChat': ytLiveTestSuperChat(pullData)
          break;
        case 'ytLiveTestSuperSticker': ytLiveTestSuperSticker(pullData)
          break;
        case 'ytLiveTestChatMessage': ytLiveTestChatMessage(pullData)
          break;
        case 'ytLiveTestJewels': ytLiveTestJewels(pullData)
          break;
        case 'ytLiveTestMembershipGiftSent': ytLiveTestMembershipGiftSent(pullData)
          break;
        case 'ytLiveTestMembershipGiftReceived': ytLiveTestMembershipGiftReceived(pullData)
          break;
        case 'ytLiveTestMembersOnlyChatStarted': ytLiveTestMembersOnlyChat(pullData, 'Started')
          break;
        case 'ytLiveTestMembersOnlyChatEnded': ytLiveTestMembersOnlyChat(pullData, 'Ended')
          break;
        case 'ytLiveTestUserBanned': ytLiveTestUserBanned(pullData)
          break;
        case 'ytLiveTestPollStarted': ytLiveTestPoll(pullData, 'Started')
          break;
        case 'ytLiveTestPollClosed': ytLiveTestPoll(pullData, 'Closed')
          break;
        default:
          break;
      }
    });
  });

  // Assuming your include statements can be placed here
  {% include youtube_triggers/js/subscriber.js %}
  {% include youtube_triggers/js/member.js %}
  {% include youtube_triggers/js/milestone.js %}
  {% include youtube_triggers/js/superchat.js %}
  {% include youtube_triggers/js/supersticker.js %}
  {% include youtube_triggers/js/chat.js %}
  {% include youtube_triggers/js/jewels.js %}
  {% include youtube_triggers/js/membership_gift_sent.js %}
  {% include youtube_triggers/js/membership_gift_received.js %}
  {% include youtube_triggers/js/members_only_chat.js %}
  {% include youtube_triggers/js/user_banned.js %}
  {% include youtube_triggers/js/poll.js %}

  {% include youtube_triggers/helpers/generateName.js %}
  {% include youtube_triggers/helpers/generateTestId.js %}
  {% include helpers/sendTriggerToSAMMI.js %}
}
