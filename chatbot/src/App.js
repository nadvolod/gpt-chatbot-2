import React, { useState } from 'react';
import axios from 'axios';
import InputComponent from './InputComponent';
import OutputComponent from './OutputComponent';
import './styles.css';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: inputValue
      }]
    };

    const headers = {
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        data,
        { headers: headers }
      );
      setOutput(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling OpenAI API:', error.response ? error.response.data : error);
      setOutput('Error: Could not retrieve response.');
    }
  };

  return (
    <div className="App">
      <InputComponent
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        inputValue={inputValue}
      />
      <OutputComponent output={output} />
    </div>
  );
};

export default App;
