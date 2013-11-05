var exec = require('child_process').exec;
var path = require('path');
var grunt = require('grunt');

module.exports = function (taskName, taskTarget, taskCLIOptions) {
  var that = this;

  this.name = taskName;
  this.target = taskTarget;
  this.cliOptions = taskCLIOptions || '';
  this.bin = 'grunt';
  this.tmpOut = 'tmp/grunt-out';

  this.buildCommand = function() {
    return this.bin+' --stack --no-color '+this.name+':'+this.target+' '+this.cliOptions+' > '+this.tmpOut;
  };

  // cb = function(info) {}  info: { cmd: , err: , code: , out: }
  this.run = function (cb) {
    var gruntTask, info = {
      cmd: this.buildCommand(),
    };
    
    grunt.file.mkdir(path.dirname(this.tmpOut));

    gruntTask = exec(info.cmd, function (err, stdout, stderr) {
      info.out = grunt.file.read(that.tmpOut);
      info.err = err;
    });

    gruntTask.on('close', function (code) {
      info.code = code;

      cb(info);
    });
  };

  this.runLogged = function(cb) {
    var log = that.logCallback();

    return this.run(function(info) {
      log(info);
      cb(info);
    });
  };

  this.logCallback = function(done) {
    return function(info) {
      if (info.code !== 0) {
        console.log('Error calling '+info.cmd, info.err);
        console.log(info.out);
      } else {
        console.log(info.cmd+' exited with code 0');
      }

      if (done !== undefined) {
        done();
      }
    };
  };
};