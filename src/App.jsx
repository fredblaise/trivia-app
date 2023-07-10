// import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [triviaQuestion, setTriviaQuestion] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [allPossibleAnswers, setAllPossibleAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  // combines correct and incorrect answer into single array
  async function combineAllAnswers(incorrectAnswers, correctAnswer) {
    let allAnswers = [];
    incorrectAnswers.map((item) => {
      item.incorrect_answers.map((incorrectAnswer) => {
        allAnswers.push(incorrectAnswer)
      });
    });
    allAnswers.push(correctAnswer);
    // Randomize order of answers in array
    allAnswers.sort(() => Math.random() - 0.5);
    setAllPossibleAnswers(allAnswers);
  }

  //Make api call to trivia api
  async function getTriviaData() {
    //Set loading boolean to true so that we know to show loading text
    setLoading(true);

    //Make trivia api call using axios
    const resp = await axios.get("https://opentdb.com/api.php?amount=1");

    setTriviaQuestion(resp.data.results);
    setCorrectAnswer(resp.data.results[0].correct_answer);

    //Combines correct and incorrect answers into single array
    await combineAllAnswers(resp.data.results, resp.data.results[0].correct_answer);

    //Set loading boolean to false so that we know to show trivia question
    setLoading(false);
  }

  useEffect(() => {
    getTriviaData();
  }, []);

  function verifyAnswer(selectedAnswer) {
    //If the selected answer equals the correct answer, increase the current points by 1
    if (selectedAnswer === correctAnswer) {
      setCurrentPoints(currentPoints + 1);
    } else {
      //If the selected answer does not equal the correct answer, decrease the current points by 1
      setCurrentPoints(currentPoints - 1);
    }

    getTriviaData();
  }

  //Converts html code to regular characters
  function removeCharacters(question) {
    return question.replace(/(&quot\;)/g, "\"").replace(/(&rsquo\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\"").replace(/(&ldquo\;)/g, "\"").replace(/(&rdquo\;)/g, "\"").replace(/(&eacute\;)/g, "é").replace(/(&shy\;)/g, "")
  }

  return (
    <div className='max-w-4xl m-auto h-screen p-4 flex flex-col justify-center items-center'>
      <p className='text-6xl font-bold fixed top-10 left-10 '>Trivia App</p>
      <div className="bg-slate-600 drop-shadow-2xl w-full p-4 text-white rounded-lg flex flex-col gap-4">
        <div className={`text-xl font-bold ${currentPoints < 0 ? 'text-red-500' : ''}`}>
          Points: {currentPoints}
        </div>
        {loading ? "Trivia Question Loading..." :
          <div>
            {triviaQuestion.map((triviaData, index) =>
              <div key={index} className='flex flex-col gap-4'>
                <p className='text-center text-xl'>
                  {removeCharacters(triviaData.question)}
                </p>
                <div className='grid grid-cols-2 [grid-auto-rows: 1fr] gap-4'>
                  {
                    allPossibleAnswers.map((answer, index) =>
                      <div key={index}>
                        <button className='bg-slate-400 hover:bg-slate-300 text-black text-xl py-2 px-4 w-full h-full rounded-lg' key={index} onClick={() => verifyAnswer(answer)} >
                          {removeCharacters(answer)}
                        </button>
                      </div>
                    )
                  }
                </div>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}

export default App;
