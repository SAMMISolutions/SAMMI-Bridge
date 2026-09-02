function ytLiveTestMembersOnlyChat(pullData, type) {
  pullData.addvalues({
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    message_id: generateYouTubeTestId(),
  });
  sendTriggerToSAMMI(53, `YouTube Members-only Chat ${type} [test trigger]`, { type }, pullData);
}
