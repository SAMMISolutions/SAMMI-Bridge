SAMMITestTwitchPrediction(form) {
    const predictSelect = form.elements['predictType'];
    const amount = form.elements['predictChoiceAmount'].value || getRandomInt(2, 10);
    const duration = form.elements['predictionDuration'].value || getRandomInt(60, 600);
    const type = predictSelect.options[predictSelect.selectedIndex].text || 'Created';
    const typeNum = type === 'Created' ? 0 : type === 'Voted' ? 1 : type === 'Locked' ? 2 : 3;
    const baseData = {
      duration: parseInt(duration),
      outcome_amount: parseInt(amount),
      vote_total: type !== 'Created' ? getRandomInt(10, 300) : 0,
      event: type,
      prediction_id: '1621385a-1f26-4197-82fc-6352003a69db',
      prediction_name: 'My Test Prediction',
      winning_outcome: type === 'Resolved' ? `e960f614-d379-494a-8b45-0c7500978${getRandomInt(0, amount - 1)}ea` : '',
    };
    const pullData = populateWithOutcomeInfo(baseData, amount, type);

    sendTriggerToSAMMI(
      15,
      `Prediction ${type} [test trigger] fired!`,
      {
        type: typeNum,
      },
      pullData,
    );
}
