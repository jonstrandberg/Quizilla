import { useState, useEffect } from "react";
import QuestionList from "../components/QuestionList";

const QuizContainer = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [numberOfQuestionsAsked, setNumberOfQuestionsAsked] = useState(0)

  useEffect(() => {
    getQuestions();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const combineAllAnswers = (incorrectAnswers, correctAnswer) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    const shuffledAnswers = shuffleArray(allAnswers);
    return shuffledAnswers;
  };

  const getQuestions = () => {
    setLoading(true);
    fetch(
      "https://the-trivia-api.com/api/questions?categories=general_knowledge&limit=1&region=GB&difficulty=medium&" +
        Math.random()
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // log the response to the console
        const questions = data.map((question) => ({
          id: question.id,
          question: question.question,
          correctAnswer: question.correctAnswer,
          incorrectAnswers: question.incorrectAnswers,
          category: question.category,
          type: question.type,
          difficulty: question.difficulty,
          allAnswers: combineAllAnswers(
            question.incorrectAnswers,
            question.correctAnswer
          ),
        }));
        console.log(questions); // log the questions array to the console
        setQuestions(questions);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentQuestion = questions[0];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setNumberOfQuestionsAsked(numberOfQuestionsAsked + 1)
    }
    setSelectedAnswers({});
    getQuestions();
  };

  return (
    <div className="questionContainer">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <QuestionList
            questions={questions}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
          />
          <button type="submit">Submit Answers</button>
        </form>
      )}
      <p>Score: {score} / {numberOfQuestionsAsked} </p>
    </div>
  );
};

export default QuizContainer;
