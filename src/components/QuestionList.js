import React from "react";
import Question from "./Question";

const QuestionList = ({ questions, selectedAnswers, onAnswerSelect }) => {
  return (
    <div className="questionList">
      {questions.map((question) => (
        <Question
          key={question.id}
          question={question.question}
          answers={question.allAnswers}
          selectedAnswer={selectedAnswers[question.id]}
          onAnswerSelect={(answer) => onAnswerSelect(question.id, answer)}
        />
      ))}
    </div>
  );
};

export default QuestionList;