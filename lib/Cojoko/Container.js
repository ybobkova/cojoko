define(['Cojoko/Joose/Reader', 'Cojoko/Writer', 'Cojoko/Compiler'], function (JooseReader, Writer, Compiler) {

  return function (Cojoko) {
    this.writer = new Writer();
    this.compiler = new Compiler();
    this.Cojoko = Cojoko;

    this.getJooseReader = function () {
      if (!this.jooseReader) {
        this.jooseReader = new JooseReader(this.Cojoko);
      }

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