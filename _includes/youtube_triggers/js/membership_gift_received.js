function ytLiveTestMembershipGiftReceived(pullData) {
  const levelName = document.getElementById('YTLiveMembershipReceivedLevel').value || 'Member';
  pullData.addvalues({
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    message_id: generateYouTubeTestId(),
    level_name: levelName,
    gifter_channel_id: 'UCgifter123456789',
    associated_gift_membership_message_id: generateYouTubeTestId(),
  });
  sendTriggerToSAMMI(56, `YouTube Membership Gift Received [test trigger] triggered for ${pullData.display_name}`, {}, pullData);
}
