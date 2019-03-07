import Ranker from '/imports/ui/pages/groupQuiz/Ranker';
import MultipleChoice from '/imports/ui/pages/groupQuiz/MultipleChoice';
import OpenQuestion from '/imports/ui/pages/groupQuiz/OpenQuestion';
import StarRatingMultiple from '/imports/ui/pages/groupQuiz/StarRatingMultiple';

export function quizComponent(name){
    var components={"MultipleChoice":MultipleChoice,"Ranker":Ranker,"OpenQuestion":OpenQuestion,"StarRatingMultiple":StarRatingMultiple};
    return components[name];
}