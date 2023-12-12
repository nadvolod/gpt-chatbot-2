import React, { useState } from 'react';
import InputComponent from './InputComponent';
import OutputComponent from './OutputComponent';
// Import OpenAI from 'openai'
import { OpenAI } from 'openai';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Instantiate OpenAI directly with the API key
      const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});
      // const completion = await openai.completions.create({
      //   model: "gpt-3.5-turbo",
      //   prompt: "Say this is a test.",
      //   max_tokens: 7,
      //   temperature: 0,
      // });
        const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: inputValue }],
        stream: true,
    });
      for await (const chunk of stream) {
          process.stdout.write(chunk.choices[0]?.delta?.content || "");
      }
      // console.log(completion);
      // setOutput(completion.data.choices[0].text);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
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
