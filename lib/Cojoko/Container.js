define(['Cojoko/Joose/Reader', 'Cojoko/Writer', 'Cojoko/Compiler'], function (JooseReader, Writer, Compiler) {

  return function () {
    this.jooseReader = new JooseReader();
    this.writer = new Writer();
    this.compiler = new Compiler();

    this.getJooseReader = function () {
      return this.jooseReader;
    };

    this.getWriter = function () {
      return this.writer;
    };

    this.getCompiler = function () {
      return this.compiler;
    };
  };
});