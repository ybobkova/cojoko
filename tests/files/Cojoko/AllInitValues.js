define(['Cojoko'],function (Cojoko) {
  return Cojoko.Class('AllInitValues', {
    properties: {
      'aBoolean': { is: 'gs', init: true},
      'aString': { is: 'gs', init: 'string content'},
      'anEmptyArray': { is: 'gs', init: []},
      'anEmptyObject': { is: 'gs', init: {}},
      'aNumberFloat': { is: 'gs', init: 3.3},
      'aNumberInt': { is: 'gs', init: 7},
      'aNull': { is: 'gs', init: null},
      'aUndefined': { is: 'gs', init: undefined}
    }
  });
});