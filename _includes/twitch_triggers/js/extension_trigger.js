SAMMITestExtensionTrigger(form) {
  let payload;
  try {
    payload = JSON.parse(form.elements.extensionTriggerPayload.value || '{}');
  } catch (error) {
    SAMMI.alert(`Extension Trigger payload is not valid JSON: ${error.message}`);
    return;
  }
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
    SAMMI.alert('Extension Trigger payload must be a JSON object.');
    return;
  }
  const triggerName = payload.trigger_name || payload.trigger || payload.name || 'Extension Trigger';
  const pullData = Object.assign({}, payload, {
    trigger_name: triggerName,
    trigger_type: 12,
  });
  if (pullData.button_id === undefined) pullData.button_id = '';
  if (pullData.instance_id === undefined) pullData.instance_id = 0;
  sendTriggerToSAMMI(
    12,
    `${triggerName} [test trigger]`,
    {
      trigger: triggerName,
    },
    pullData,
  );
}
