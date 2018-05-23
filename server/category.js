Meteor.methods({
    'generate.pregame.quiz.from.csv': function() {
        var lines = Papa.parse(Assets.getText("WeQCategory.csv")).data;

        if(lines.length > 0){
            var holder={}
            for (var i = 1; i < lines.length; i++) {
                if(holder[lines[i][0]] && holder[lines[i][0]].subCategory){
                    if(holder[lines[i][0]].subCategory && holder[lines[i][0]].subCategory.indexOf(lines[i][1]) < 0){
                        holder[lines[i][0]].subCategory.push(lines[i][1]);
                    }
                }else{
                    holder[lines[i][0]] = {
                        subCategory:[lines[i][1]]
                    };
                }
            }

            return holder;
        }
    },
});