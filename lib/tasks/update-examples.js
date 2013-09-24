module.exports = function(grunt) {

  grunt.registerMultiTask ('update-examples', 'Use update-examples to paste tested examples in the Cojoko-documentation', function() {
    var docuPaths = grunt.file.expand(grunt.util._.pluck(this.files, 'src'));
    var _ = grunt.util._;

    _.each(docuPaths, function(path) {
      var docuText = grunt.file.read(path);
      grunt.log.writeln("File "+ path +" is found");
      var example = docuText.match(/\s*\*\*\*[a-zA-Z1-9\s]+\*\*\*\s*```javascript.*?```/);
      _.each(example, function(ex) {
        var exampleName = ex.match(/^\s*\*\*\*[a-zA-Z1-9\s]+\*\*\*\s*$/);
        exampleName = exampleName.match(/[a-zA-Z1-9\s]+/).trim;
        var examplePlace = ex.match(/```javascript.*?```/);
        var testFile = 'tests/Cojoko/examples/'+ exampleName + 'Test.js';
        var testCode = grunt.file.read(testFile);
        var exampleRegexp = new RegExp(/\/\* beginning of the example \*\/.*?(?=\/\* end of the example \*\/)/);
        var exampleCode = exampleRegexp.exec(testCode);
        exampleCode = exampleCode.replace("/* beginning of the example */", "");
        exampleCode = "```javascript\n" + exampleCode + "\n```\n";
        docuText.replace(examplePlace, exampleCode);
      });
      // удалить текст файла!!
      grunt.file.write(path, docuText);
    });
  });
};