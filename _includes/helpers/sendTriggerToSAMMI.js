function sendTriggerToSAMMI(
  type,
  message = 'Test trigger fired.',
  data = {},
  triggerData,
) {
  data.trigger_data = triggerData;
  SAMMI.testTrigger(type, data);
  SAMMI.alert(message);
}
