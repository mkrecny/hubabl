var Events = 
{   
    blockCreate:false,
    gSearch:new google.search.SearchControl(),
    
    registerAll:function()
    {
        SocketManager.attachClient(SocketManager.getParameterByName('chid'));
        
        $('#topic_input').click(function()
        {
            $('#topic_input').val('');
        });
        
        $('#topic_input').keyup(function(e) 
        {
        	if(e.keyCode == 13) 
        	{   
        	    if (Events.blockCreate)
        	    {
        	        return;
        	    }
        	    Events.blockCreate = true;
                SocketManager.createNewChat();
        	}
        });
        
        $('#msg_input_box').keyup(function(e) 
        {
        	if(e.keyCode == 13) 
        	{   
        	    var msg = $('#msg_input_box').val();
        		SocketManager.sendChat(msg);
        	}
        });
        
        $('#new_chat').click(function()
        {
            window.location.href = 'http://'+GLOBAL_CONF.server_uri;
        });
        
        $('#about').hover(function()
        {
           $('#about_txt').fadeIn(); 
        }, function()
        {
            $('#about_txt').fadeOut();
        });
        
                        
    },
    
    
    
}