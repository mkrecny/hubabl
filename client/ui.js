var UI = 
{   
    name:'',
    embed:0,
    
    renderChat:function(data, embed)
    {   
        Events.blockCreate = false;
        UI.embed=embed;
        UI.name=data.name.charAt(0).toUpperCase() + data.name.slice(1);
        UI.hideCreateEls();
        $('#topic_box').text(UI.stripHtml(data.topic));
        $('#share').html('sh:<input style="color:#FF3D2E" type="text" class="join_el" value="'+data.url+'"/>');
        var iframe = '<iframe src="http://'+GLOBAL_CONF.server_uri+'?chid='+SocketManager.chat_id+'&embed=1" width="350px" height="600px"></iframe>';
        $('#embed').html('em:<textarea style="color:#FF3D2E" class="join_el">'+iframe+'</textarea>');
        
        for (var i in data.history)
        {
            UI.appendNewMsg(data.history[i],  false);
        }
        
        UI.embed ? UI.showEmbedEls() : UI.showJoinEls();
    },
    
    appendNewMsg:function(data, scroll)
    {   
        var colon_pos = data.indexOf(':');
        var name = UI.stripHtml(data.substr(0,colon_pos));
        var txt = UI.stripHtml(data.substr(colon_pos+3, data.length));
        var msg = $('<div class="chat_line_cont"><span class="chat_line" class="join_el embed_el"><b>'+name+':</b> '+txt+'<span></div>');
        $('#msg_box').append(msg);
        
        if (scroll)
        {   
            UI.embed ? '' : UI.showJoinEls();
            UI.scrollDown();
        }
 
    },
    
    scrollDown:function()
    {
        $('#msg_box').animate({scrollTop: $('#msg_box')[0].scrollHeight});
    },
    
    showCreateEls:function()
    {
        $('.create_el').each(function(index, el)
        {
            $(el).fadeIn(1200);
        });
    },
    
    hideCreateEls:function()
    {
        $('.create_el').hide();
    },
    
    showJoinEls:function()
    {
        $('.join_el').each(function(index, el)
        {
            $(el).fadeIn(1200);
        });
        
        UI.scrollDown();
    },
    
    showEmbedEls:function()
    {    
         $('#logo').hide();
         $('#chat_box').css({top:'0px', left:'0px', width:'100%', height:'100%'});
         
         $('.embed_el').each(function(index, el)
         {
            $(el).fadeIn(1200);
         });
         
        UI.scrollDown();
    },
    
    hideJoinEls:function()
    {
        $('.join_el').hide();
    },
    
    stripHtml:function(html)
    {
       var tmp = document.createElement("DIV");
       tmp.innerHTML = html;
       return tmp.textContent||tmp.innerText;
    }
    
}