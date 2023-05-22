// split a total amount into several parts
function* splitNParts(num, parts) {
  let sumParts = 0;
  for (let i = 0; i < parts - 1; i++) {
    const pn = Math.ceil(Math.random() * (num - sumParts));
    yield pn;
    sumParts += pn;
  }
  yield num - sumParts;
}
