exports.getChatCountKey = function()
{
    return 'chatcount';
}

exports.getChatKey = function(chat_id)
{
    return 'ch:'+chat_id+':info';
}

exports.getChatChanKey = function(chat_id)
{
    return 'ch:'+chat_id+':chan';
}

exports.getChatHistoryKey = function(chat_id)
{
    return 'ch:'+chat_id+':hist';
}