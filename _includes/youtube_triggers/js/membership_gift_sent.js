function ytLiveTestMembershipGiftSent(pullData) {
  const giftCount = parseInt(document.getElementById('YTLiveMembershipGiftCount').value, 10) || 5;
  const levelName = document.getElementById('YTLiveMembershipGiftLevel').value || 'Member';
  pullData.addvalues({
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    message_id: generateYouTubeTestId(),
    gift_count: giftCount,
    level_name: levelName,
  });
  sendTriggerToSAMMI(52, `YouTube Membership Gift Sent [test trigger] triggered by ${pullData.display_name}`, { amount: giftCount }, pullData);
}
