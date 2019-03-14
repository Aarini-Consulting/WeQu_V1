export function formatErrMessage(msg){
    if(typeof msg == "string"){
        var formattedMsg = msg.replace(/_/g, ' ');
        formattedMsg = formattedMsg.charAt(0).toUpperCase() + formattedMsg.slice(1);
        return formattedMsg;
    }else{
        return msg;
    }
    
}