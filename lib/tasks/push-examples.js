module.exports = function(grunt) {

  grunt.registerMultiTask ('push-examples', 'Use push-examples to paste tested examples in the Cojoko-documentation', function() {
    var docuPaths = grunt.file.expand(grunt.util._.pluck(this.files, 'src'));
    var _ = grunt.util._;

    var commentWithExampleRegexp = new RegExp("```javascript\\s*\\n+//.*?Example:.*?```", "g");
    var commentRegexp = new RegExp("^```javascript\\s*//.*?$");
    var exampleNameRegexp = new RegExp("(?://).*?(?=:)");
    var exampleInTestRegexp = new RegExp("\\/\\* beginning of the example \\*\\/.*?(?=\\/\\* end of the example \\*\\/)");
    var exampleInDocsFile = new RegExp("```javascript.*?```");
    
    _.each(docuPaths, function(path) {

      var docuText = grunt.file.read(path);
      grunt.log.writeln("File "+ path +" is found");
      var example = commentWithExampleRegexp.exec(docuText);

      _.each(example, function(ex) {
        var exampleName = exampleNameRegexp.match(ex); //we find the name of the example in the comment
        exampleName = exampleName.replace("//", "");
        var testFile = 'tests/Cojoko/examples/'+ exampleName + 'Test.js'; //we use it to open the test file
        var testCode = grunt.file.read(testFile); // we read the test file
        var exampleCode = exampleInTestRegexp.exec(testCode); //we find the code of the example in the test file
        exampleCode = exampleCode.replace("/* beginning of the example */", "");
        var examplePlace = exampleInDocsFile.exec(ex); //we find the place in the documentation, that should be replaced
        var jsAndComment = commentRegexp.exec(ex); //the ```javascript and the comment (to write it at the beginning of the new example)
        exampleCode = jsAndComment + exampleCode + "\n```\n"; //we build the new example, that should be pasted ib the docu file

        docuText.replace(examplePlace, exampleCode); //we replace the old example with the new
      });

      grunt.file.write(path, docuText); //we replace the old text of the docu file with the new
    });
  });
};