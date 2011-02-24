var sys = require('sys'); 
var flr = require('./linereader.js');
var redis = require('redis').createClient('6379', '127.0.0.1');

var reader = new flr.FileLineReader('adjectives', 10);

while(reader.hasNextLine())
{
  var word = reader.nextLine();
  if (word.length>1 && word!='')
{
  console.log(word);
  redis.sadd('words', word.replace(/^\s+|\s+$/g,""));
}
}
