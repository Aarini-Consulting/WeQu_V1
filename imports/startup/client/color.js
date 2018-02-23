export function color(name){
    switch(name.toString().toLowerCase()) {
        case "communication":
            return "#0ad";
            break;
        case "virtue":
            return "#d2316c";
            break;
        case "leadership":
            return "#273888";
            break;
        case "teamwork":
            return "#f75f04";
            break;
        case "problem_solving":
            return "#3ba12b";
            break;
        case "self_management":
            return "#9a61ba";
            break;
        default:
            return ""
    } 
}