var config = require('../config.js');
var keys = require('./keys.js');
var redis = require('redis').createClient(config.redis_port, config.redis_server);
var Bitly = require('./node-bitly/lib/bitly/Bitly.js').Bitly;
var bitly_client = new Bitly(config.bitly_usr, config.bitly_api);

exports.createNewChat = function(topic, callBack)
{   
    redis.incr(keys.getChatCountKey(), function(err, chat_id)
    {
        var long_url = 'http://'+config.server_uri+"/?chid="+chat_id;

        bitly_client.shorten(long_url, function(result)
        {   
            var chat_info = {topic:topic, url:result.data.url, chat_id:chat_id};
            
            redis.hmset(keys.getChatKey(chat_id), chat_info, function(err, res)
            {
                !err ? callBack(chat_info) : '';
            });
        });

    });
}

exports.getChatInfo = function(chat_id, callBack)
{
    redis.hgetall(keys.getChatKey(chat_id), function(err, chat_info)
    {
       exports.getChatHistory(chat_id, function(history)
       {     
          chat_info.history = history;
          callBack(chat_info); 
       }); 
    });
}

exports.getChatHistory = function(chat_id, callBack)
{
    redis.lrange(keys.getChatHistoryKey(chat_id), 0, -1, function(err, res)
    {
        callBack(res);
    });
}

exports.sendMsgToClient = function(client, action, msg_body)
{   
    console.log('sending render to client:');
    console.log(msg_body);
    msg_body.action = action;
    client.send(JSON.stringify(msg_body));
}

exports.addMsgToHistory = function(chat_id, msg)
{
    redis.rpush(keys.getChatHistoryKey(chat_id), msg);
}

exports.appendUserData = function(obj, callBack)
{
    redis.srandmember('words', function(err,word1)
    {
       obj.name = word1;
       callBack(obj);
    });
}
