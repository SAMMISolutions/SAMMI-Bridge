function ytLiveTestMember(pullData) {
  pullData.addvalues({
    channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    level_name: 'Some level name',
  });

  sendTriggerToSAMMI(
    22,
    `YouTube Member [test trigger] triggered by ${pullData.display_name}`,
    {},
    pullData,
  );
}
