SAMMITestExtensionTrigger(form) {
  const defaultPayload = {
    String: 'Test',
    Number: 5,
    Array: [1, 2, 3],
    Object: {
      String: 'Test',
      Number: 1,
    },
  };
  let payload;
  try {
    const payloadText = form.elements.extensionTriggerPayload.value.trim() || JSON.stringify(defaultPayload, null, 2);
    payload = JSON.parse(payloadText);
  } catch (error) {
    SAMMI.alert(`Extension Trigger payload is not valid JSON: ${error.message}`);
    return;
  }
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
    SAMMI.alert('Extension Trigger payload must be a JSON object.');
    return;
  }
  const triggerNameInput = (form.elements.extensionTriggerName.value || '').trim();
  const triggerName = triggerNameInput || payload.trigger_name || payload.trigger || payload.name || 'Extension Trigger';
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
