import GroupQuizResultRanker from '/imports/ui/pages/groupQuizResult/GroupQuizResultRanker';
import GroupQuizResultMultipleChoice from '/imports/ui/pages/groupQuizResult/GroupQuizResultMultipleChoice';
import GroupQuizResultOpenQuestion from '/imports/ui/pages/groupQuizResult/GroupQuizResultOpenQuestion';
import GroupQuizResultStarRatingMultiple from '/imports/ui/pages/groupQuizResult/GroupQuizResultStarRatingMultiple';

export function quizResultComponent(name){
    var components={
        "MultipleChoice":GroupQuizResultMultipleChoice,
        "Ranker":GroupQuizResultRanker,
        "OpenQuestion":GroupQuizResultOpenQuestion,
        "StarRatingMultiple":GroupQuizResultStarRatingMultiple};
    return components[name];
}