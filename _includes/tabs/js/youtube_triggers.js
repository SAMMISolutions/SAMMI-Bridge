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
    'ytLiveTestChatMessage'
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

  {% include youtube_triggers/helpers/generateName.js %}
  {% include helpers/sendTriggerToSAMMI.js %}
}
