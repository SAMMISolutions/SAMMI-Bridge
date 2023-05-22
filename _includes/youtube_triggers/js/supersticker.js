function ytLiveTestSuperSticker(pullData) {
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

  sendTriggerToSAMMI(
    21,
    `YouTube Super Sticker [test trigger] triggered by ${pullData.display_name}`,
    { amount },
    pullData,
  );
}
