import React, { useState } from 'react';
import Navbar from '@/component/Navbar';

interface Question {
  text: string;
  options: string[];
}

const CreateSurveyForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([{ text: '', options: [''] }]);

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: [''] }]);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでアンケートの送信処理を行う
  };

  return (
    <div>
    <Navbar />
    <form onSubmit={handleSubmit}>
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-4 p-4 border border-gray-300 rounded">
  <label className="block font-bold mb-2">質問 {questionIndex + 1}：</label>
  <input
    type="text"
    value={question.text}
    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
    required
    className="w-1/2 p-2 border border-gray-300 rounded"
  />
  <div className="mt-2">
    <label className="block font-bold mb-2">選択肢：</label>
    {question.options.map((option, optionIndex) => (
      <div key={optionIndex} className="flex items-center mb-2">
        <input
          type="text"
          value={option}
          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
          required
          className="w-60 p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={() => removeOption(questionIndex, optionIndex)}
          className="ml-2 text-red-500"
        >
          削除
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addOption(questionIndex)}
      className="text-green-500"
    >
      選択肢追加
    </button>
  </div>
</div>

      ))}
      <button
  type="button"
  onClick={() => addQuestion()}
  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
>
  質問追加
</button>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        アンケートを作成
      </button>
    </form>
    </div>
  );
};

export default CreateSurveyForm;
