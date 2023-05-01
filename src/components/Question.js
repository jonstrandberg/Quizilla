import './Question.css';

const Question = ({ question, answers, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className="question_container">
      <p className="question">{question}</p>
      <ul>
        {answers.map((answer, index) => (
          <li 
            className={selectedAnswer === answer ? 'answerOptions selected' : 'answerOptions'}
            key={index}
            onClick={() => onAnswerSelect(answer)}
          >
            <div className={`radio-button ${selectedAnswer === answer ? 'selected' : ''}`} />
            <label>{answer.charAt(0).toUpperCase() + answer.slice(1)}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;




