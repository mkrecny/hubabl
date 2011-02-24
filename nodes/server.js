var config = require('../config.js');
var manager = require('./chatmanager.js');
var sys  = require('sys');
var io   = require('socket.io');
var http = require('http');
var redis_lib = require('redis');
var keys = require('./keys.js');
var global_redis = require('redis').createClient(config.redis_port, config.redis_server);

server = http.createServer(function(req, res) 
{ 
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  res.end(); 
});

server.listen(config.server_port, config.server_uri);

// socket.io 
var socket = io.listen(server); 

socket.on('connection', function(client)
{ 
    var redis_client = redis_lib.createClient(config.redis_port, config.redis_server);
    
    redis_client.on('pmessage', function(p,c,msg)
    {
       client.send(msg);
    });
    
	client.on('message', function(message)
	{ 	
		message = JSON.parse(message);
        switch(message.action)
        {
            case 'join':
            manager.getChatInfo(message.value, function(chat_info)
            {                  
               redis_client.psubscribe(keys.getChatChanKey(message.value));
               chat_info.chat_id = message.value;
               manager.appendUserData(chat_info, function(new_chat_info)
               {
                   manager.sendMsgToClient(client, 'render', new_chat_info);                   
               });
            });
            break;
            
            case 'create':
            manager.createNewChat(message.value, function(chat_info)
            {
               redis_client.psubscribe(keys.getChatChanKey(chat_info.chat_id));
               manager.appendUserData(chat_info, function(new_chat_info)
               {
                   manager.sendMsgToClient(client, 'render', new_chat_info);                   
               });
            });
            break;
            
            case 'new_msg':
            manager.addMsgToHistory(message.chat_id, message.value);
            global_redis.publish(keys.getChatChanKey(message.chat_id), JSON.stringify({action:'msg', value:message.value}));
            break;
        }
	}); 
	
	client.on('disconnect', function()
	{  
		redis_client.end();
	});
	
});

