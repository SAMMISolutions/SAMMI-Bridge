function ytLiveTestMilestone(pullData) {
  const months = document.getElementById('YTLiveMilestoneMonth').value || Math.ceil(Math.random() * 10);
  const level_name = document.getElementById('YTLiveMilestoneLevel').value || 'Some level name';
  const message = document.getElementById('YTLiveMilestoneMsg').value || SAMMI.generateMessage();

  pullData.addvalues({
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    level_name,
    message,
    months,
  });

  sendTriggerToSAMMI(
    22,
    `YouTube Member Renewal [test trigger] triggered by ${pullData.display_name}`,
    {},
    pullData,
  );
}
