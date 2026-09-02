function ytLiveTestJewels(pullData) {
  const jewels = parseInt(document.getElementById('YTLiveJewelsAmount').value, 10) || 100;
  const giftName = document.getElementById('YTLiveJewelsGiftName').value || 'YAY GIF';
  pullData.addvalues({
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    message_id: generateYouTubeTestId(),
    jewels,
    gift_name: giftName,
    gift_url: 'https://www.youtube.com/live_chat',
    has_visual_effect: true,
    combo_count: 1,
    alt_text: `${giftName} gift`,
    language: 'en',
    gift_duration_seconds: 5,
    gift_duration_nanos: 0,
  });
  sendTriggerToSAMMI(51, `YouTube Jewels [test trigger] triggered by ${pullData.display_name}`, { amount: jewels }, pullData);
}
