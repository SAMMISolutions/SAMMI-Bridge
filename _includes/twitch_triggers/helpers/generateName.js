function generateName(name = '') {
    const names = [
      ['Melonax', '41809329'],
      ['RamsReef', '91464575'],
      ['Wellzish', '461898318'],
      ['Andilippi', '47504449'],
      ['Cyanidesugar', '76159058'],
      ['Silverlink', '489730'],
      ['wolbee', '72573038'],
      ['Davidihewlett', '116807809'],
      ['DearAsMax', '478335805'],
      ['Estudiando_Ajedrez', '184806573'],
      ['RoadieGamer', '450427842'],
      ['chrizzz_1508', '88246295'],
      ['MisterK_Qc', '475765680'],
      ['Falinere', '144606537'],
      ['Landie', '78949799'],
      ['Phat32', '24565497'],
      ['mofalkmusic', '443568234'],
      ['NikiYanagi', '528140333'],
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    if (name !== randomName) return randomName;
    return generateName(name);
  }