import Ranker from '/imports/ui/pages/groupQuiz/Ranker';
import MultipleChoice from '/imports/ui/pages/groupQuiz/MultipleChoice';
import OpenQuestion from '/imports/ui/pages/groupQuiz/OpenQuestion';
import StarRatingMultiple from '/imports/ui/pages/groupQuiz/StarRatingMultiple';

import GroupQuizResultRanker from '/imports/ui/pages/groupQuizResult/GroupQuizResultRanker';
import GroupQuizResultMultipleChoice from '/imports/ui/pages/groupQuizResult/GroupQuizResultMultipleChoice';
import GroupQuizResultOpenQuestion from '/imports/ui/pages/groupQuizResult/GroupQuizResultOpenQuestion';
import GroupQuizResultStarRatingMultiple from '/imports/ui/pages/groupQuizResult/GroupQuizResultStarRatingMultiple';

export function quizComponent(name){
    var components={"MultipleChoice":MultipleChoice,"Ranker":Ranker,"OpenQuestion":OpenQuestion,"StarRatingMultiple":StarRatingMultiple};
    return components[name];
}

export function quizResultComponent(name){
    var components={
        "MultipleChoice":GroupQuizResultMultipleChoice,
        "Ranker":GroupQuizResultRanker,
        "OpenQuestion":GroupQuizResultOpenQuestion,
        "StarRatingMultiple":GroupQuizResultStarRatingMultiple};
    return components[name];
}