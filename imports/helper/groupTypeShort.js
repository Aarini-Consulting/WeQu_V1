const groupTypeShortList = ["short", "short-praise", "short-criticism"];

function groupTypeIsShort(type){
    return groupTypeShortList.includes(type);
};

export {groupTypeShortList, groupTypeIsShort}