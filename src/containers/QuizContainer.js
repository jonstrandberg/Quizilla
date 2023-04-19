import { useState, useEffect } from "react";
import QuestionList from "../components/QuestionList";
import { database } from "./firebase";
import { getAuth, signInWithPopup } from "firebase/auth";
import backgroundImg from "../img/PurpleHex.jpg"
import './QuizContainer.css';


const QuizContainer = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [numberOfQuestionsAsked, setNumberOfQuestionsAsked] = useState(0);
  const currentQuestion = questions[0];
  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const [askedQuestionsIds, setAskedQuestionsIds] = useState([]);


  const auth = getAuth();

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    // Reset the Firebase database and the count of questions asked
    if (numberOfQuestionsAsked >= 600) {
      database.ref("answers").remove();
      setNumberOfQuestionsAsked(0);
    }
  }, [numberOfQuestionsAsked]);

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
      "https://the-trivia-api.com/api/questions?categories=general_knowledge,geography,history,food_and_drink,science,society_and_culture,sport_and_leisure,music,film_and_tv,arts_and_literature&limit=1&region=GB&difficulty=medium&" +
        Math.random()
        // "https://the-trivia-api.com/api/questions?categories=general_knowledge&limit=1&region=GB&difficulty=medium&"
    )
      .then((res) => res.json())
      .then((data) => {
        const newQuestion = {
          id: data[0].id,
          question: data[0].question,
          correctAnswer: data[0].correctAnswer,
          incorrectAnswers: data[0].incorrectAnswers,
          category: data[0].category,
          type: data[0].type,
          difficulty: data[0].difficulty,
          allAnswers: combineAllAnswers(
            data[0].incorrectAnswers,
            data[0].correctAnswer
          ),
        };
  
        const answeredQuestionIds = Object.values(selectedAnswers).map(
          (answer) => answer.questionId
        );
  
        if (answeredQuestionIds.includes(newQuestion.id) || askedQuestionsIds.includes(newQuestion.id)) {
          // If the new question has already been answered or asked, get another question
          getQuestions();
        } else {
          // Otherwise, set the new question and update the askedQuestionsIds state
          setQuestions([newQuestion]);
          setLoading(false);
          setAskedQuestionsIds([...askedQuestionsIds, newQuestion.id]);
        }
      })
      .catch((error) => console.error(error));
  };
  
  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (questions.length === 0) {
      return;
    }
  
    // Check if the current question has already been answered
    const answersRef = database.ref("answers");
    answersRef.once("value", (snapshot) => {
      const answeredQuestionIds = Object.values(snapshot.val() || {}).map(
        (answer) => answer.questionId
      );
      if (answeredQuestionIds.includes(currentQuestion.id)) {
        setSelectedAnswers({});
        getQuestions();
        return;
      }
    });
  
    // Update score and number of questions asked if the selected answer is correct
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setNumberOfQuestionsAsked(numberOfQuestionsAsked + 1);
    } else {
      setNumberOfQuestionsAsked(numberOfQuestionsAsked + 1);
    }
  
    // Clear the selected answers and get new questions
    setSelectedAnswers({});
    getQuestions();
  
    // Push the question ID and selected answer to the "answers" node in the database
    database.ref("answers").push({
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer,
    });
  
    // Reset Firebase database and count of questions asked if threshold is reached. Threshold is set for 600 unique questions
    if (numberOfQuestionsAsked >= 600) {
      await database.ref("answers").remove();
      setNumberOfQuestionsAsked(0);
    }
  };

  return (
    <div className="quiz-container-parent">
    <div className="quiz-container-bg"></div>
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
          <button type="submit">Submit Answer</button>
        </form>
      )}
    </div>
    <div className="score-container">
    <p className="score">Score: {score} / {numberOfQuestionsAsked} </p>
    </div>
    </div>
  );
};

export default QuizContainer;
