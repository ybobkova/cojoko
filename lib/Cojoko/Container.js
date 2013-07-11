define(['Cojoko/Joose/Reader'], function (JooseReader) {

  return function () {
    this.jooseReader = new JooseReader();

    this.getJooseReader = function () {
      return this.jooseReader;
    };

  };
});