function ytLiveTestChatMessage(pullData) {
  const message = document.getElementById('YTLiveChatMessageMsg').value || SAMMI.generateMessage();
  pullData.addvalues({
    display_name: document.getElementById('YTLiveChatMessageName').value || pullData.display_name,
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    message: message.replace(/"/g, "'"),
    is_broadcaster: YTLiveChatMessageBroadcaster.checked,
    is_moderator: YTLiveChatMessageMod.checked,
    is_member: YTLiveChatMessageMember.checked,
    is_verified: YTLiveChatMessageVerified.checked,
  });

  sendTriggerToSAMMI(
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
