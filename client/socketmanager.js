var SocketManager = 
{	
    socket:null,
    chat_id:null,
    	
	attachClient:function(chat_id)
	{	    
			WEB_SOCKET_SWF_LOCATION = GLOBAL_CONF.server_uri+':'+GLOBAL_CONF.server_port+'/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf';

			SocketManager.socket = new io.Socket(GLOBAL_CONF.server_uri, {port: GLOBAL_CONF.server_port, rememberTransport: false});

			SocketManager.socket.on('connect', function() 
			{
			    chat_id ? SocketManager.sendMessage({action:'join', value:chat_id}) :'';
			});
			
			SocketManager.socket.on('message', function(data) 
			{
				SocketManager.executeMessage(data);
			});

			SocketManager.socket.connect();
			
			//Should happend in the connect callback
			if (!chat_id)
	        {   
	            UI.showCreateEls();
	        }
		
	},
	
	createNewChat:function()
	{
        var topic = $('#topic_input').val();
        
        if (!topic || topic=="Your topic goes here...")
        {
            topic = '';
        }
        
        SocketManager.sendMessage({action:'create', value:topic});
	},
	
	sendChat:function(msg)
	{    
	  SocketManager.sendMessage({action:'new_msg', value:UI.name+':  '+msg, name:UI.name, color:UI.color, chat_id:SocketManager.chat_id});  
	},
	
	executeMessage:function(message)
	{	
		message = jQuery.parseJSON(message);
		
        switch(message.action)
        {
            case 'render':
            SocketManager.chat_id = message.chat_id;
            UI.renderChat(message, SocketManager.getParameterByName('embed'));
            break;
            
            case 'msg':
            UI.appendNewMsg(message.value, true);
            break;
        }
	},
	
	sendMessage:function(msg_object)
	{
	 	SocketManager.socket.send($.toJSON(msg_object));
	 	$('#msg_input_box').val("");
	},
		
	getParameterByName:function(name)
	{
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( window.location.href );
	  if( results == null )
	    return "";
	  else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
		
}