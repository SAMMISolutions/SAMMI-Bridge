function ytLiveTestSub(pullData) {
  sendTriggerToSAMMI(
    19,
    `YouTube Subscription [test trigger] triggered by ${pullData.display_name}`,
    {},
    pullData,
  );
}
