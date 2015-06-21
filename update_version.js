#! /usr/local/bin/node

var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');

var version = require('./cropit.jquery.json').version;

sys.puts('Version = ' + version);

['package', 'bower'].forEach(function(f) {
  var meta = require('./' + f + '.json');
  meta.version = version;

  fs.writeFileSync(f + '.json', JSON.stringify(meta, null, '  ') + '\n');
  sys.puts('Finished ' + f + '.json');
});

exec('webpack', function (error, stdout, stderr) { sys.puts(stdout) });
