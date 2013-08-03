define(['Cojoko/Joose/Reader', 'Cojoko/Writer', 'Cojoko/Compiler', 'Test/GetWrapper', 'Cojoko/ClassCodeReader'], function (JooseReader, Writer, Compiler, getWrapper, classCodeReader) {

  return function (Cojoko) {
    this.writer = new Writer();
    this.compiler = new Compiler();
    this.classCodeReader = classCodeReader;
    this.Cojoko = Cojoko;

    this.defineReader = {
      read: function (jsCode) {
        return getWrapper(jsCode);
      }
    };

    this.getClassCodeReader = function () {
      return this.classCodeReader;
    };

    this.getJooseReader = function () {
      if (!this.jooseReader) {
        this.jooseReader = new JooseReader(this.Cojoko);
      }

      return this.jooseReader;
    };


    this.getDefineReader = function () {
      return this.defineReader;
    };

    this.getWriter = function () {
      return this.writer;
    };

    this.getCompiler = function () {
      return this.compiler;
    };
  };
});