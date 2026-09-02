function ytLiveTestPoll(pullData, type) {
  const question = document.getElementById('YTLivePollQuestion').value || 'Which option do you prefer?';
  pullData.addvalues({
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    message_id: generateYouTubeTestId(),
    question,
    status: type === 'Started' ? 'active' : 'closed',
    options: [
      { optionText: 'Option A', tally: 10 },
      { optionText: 'Option B', tally: 5 },
    ],
  });
  sendTriggerToSAMMI(54, `YouTube Poll ${type} [test trigger]`, { type }, pullData);
}
