/*global module:false*/
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadTasks('lib/tasks');

  var port = 8000;
  var hostname = 'localhost';
  var nodepath = require("path");
  
  var mapToUrl = function(files) {
    var baseUrl = 'http://'+hostname+':'+port+'/';
    
    var urls = grunt.util._.map(
      grunt.file.expand(files),
      function (file) {
        return baseUrl+file;
      }
    );
    
    return urls;
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js', '!tests/testTemplate.js'],
      options: {
        curly: false, /* dont blame for missing curlies around ifs */
        eqeqeq: true,
        immed: true,
        latedef: true,
        devel: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        globals: {
          $: true,
          define: true, require: true,

          Psc: true,
          tiptoi: true,
          CoMun: true,
          QUnit: true, module: true, stop: true, start: true, ok: true, asyncTest: true, test: true, expect: true
        }
      }
    },
    
    qunit: {
      all: {
        options: {
           urls: mapToUrl('tests/**/*Test.html')
        }
      },
      single: {
        options: {
          urls: '<%= qunit.single.urls %>'
        }
      },
      options: {
        timeout: 2000,
        inject: false
      }
    },
    'update-tests': {
      options: {
      },
      src: ['tests/**/*Test.js']
    },
    concat: {
      options: {
        banner:
          '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js', 'lib/**/*.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      dist: {
        src: ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    connect: {
      server: {
        options: {
          hostname: hostname,
          port: port,
          base: '.'
        }
      },
      listenserver: {
        options: {
          hostname: hostname,
          port: port,
          base: '.',
          keepalive: true
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "lib",
          mainConfigFile: "lib/boot-helper.js",
          out: "build/psc-cms-js.min.js",

          name: "main",
          /*
          
          findNestedDependencies: true,
          */
          optimize: "none"
        }
      }
    }
  });

  grunt.task.registerTask('pack', ['jshint', 'requirejs']);
  grunt.task.registerTask('default', ['jshint', 'connect:server', 'qunit:all']);
  grunt.task.registerTask('server', ['connect:listenserver']);
  grunt.task.registerTask('travis', ['jshint', 'connect:server', 'qunit:all']);

  grunt.task.registerTask('test', 'runs testfiles per minimatch finder', function (tests) {
    if (tests) {
      grunt.config.set('qunit.single.urls', mapToUrl('tests/**/'+tests+'*Test.html'));
      grunt.task.run('connect:server', 'qunit:single');
    } else {
      grunt.task.run('connect:server', 'qunit:all');
    }
  });
};
