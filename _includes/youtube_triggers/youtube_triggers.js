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

  {% include youtube_triggers/js/subscriber.js %}
  {% include youtube_triggers/js/member.js %}
  {% include youtube_triggers/js/milestone.js %}
  {% include youtube_triggers/js/superchat.js %}
  {% include youtube_triggers/js/supersticker.js %}
  {% include youtube_triggers/js/chat.js %}

  {% include youtube_triggers/helpers/generateName.js %}
  {% include helpers/sendTriggerToSAMMI.js %}
}
