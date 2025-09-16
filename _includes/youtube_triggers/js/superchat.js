function ytLiveTestSuperChat(pullData) {
  const amount = parseInt(document.getElementById('YTLiveSuperChatAmount').value) || Math.ceil(Math.random() * 1000000);
  const tier = document.getElementById('YTLiveSuperChatTier').value || Math.ceil(Math.random() * 5);
  const message = document.getElementById('YTLiveSuperChatMsg').value || SAMMI.generateMessage();

  pullData.addvalues({
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    amount,
    amount_as_string: `$${amount / 1000000}`,
    currency: 'USD',
    message,
    tier,
  });

  sendTriggerToSAMMI(
    20,
    `YouTube Super Chat [test trigger] triggered by ${pullData.display_name}`,
    { amount },
    pullData,
  );
}
