

const Question = ({ question, answers, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className="question">
      <h3>{question}</h3>
      <ul>
        {answers.map((answer, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => onAnswerSelect(answer)}
              />
              {answer}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;




