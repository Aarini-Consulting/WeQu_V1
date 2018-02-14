export function badges(name, more){
    if(name){
        if(more){
            return "qualityname " + name.toString().toLowerCase();
        }else{
            return "qualityname " + name.toString().toLowerCase() + " less";
        }
    }else{
        return undefined;
    }
    
}