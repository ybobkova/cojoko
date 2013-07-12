define(['Cojoko/Joose/Reader', 'Cojoko/Writer'], function (JooseReader, Writer) {

  return function () {
    this.jooseReader = new JooseReader();
    this.writer = new Writer();

    this.getJooseReader = function () {
      return this.jooseReader;
    };

    this.getWriter = function () {
      return this.writer;
    };
  };
});