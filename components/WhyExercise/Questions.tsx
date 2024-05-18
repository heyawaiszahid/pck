import { Question } from "@/app/why-exercise/types";
import { useState } from "react";

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>(["What do you want to achieve in life?"]);

  return (
    <div className="questions">
      {questions.map((question, index) => (
        <div key={index} className="box">
          <div className="dot"></div>
          <p className="question">
            <span> Level {index + 1}: </span>
            {question}
          </p>
          <div className="answer">
            <input type="text" placeholder="Type your answer here and press Enter." />
          </div>
        </div>
      ))}
    </div>
  );
}
