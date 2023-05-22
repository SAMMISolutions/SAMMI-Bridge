async function getNameFromInput(input) {
  let name; let userID;
  if (input.value.length > 0) {
    name = input.value;
    userID = await getUserID(name)
      .catch((e) => name = e);
  } else {
    [name, userID] = generateName();
  }
  return [name, userID];
}
