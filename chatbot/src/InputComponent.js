// InputComponent.js
import React from 'react';

const InputComponent = ({ onInputChange, onSubmit, inputValue }) => {
  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={onInputChange}
        placeholder="Enter your text"
      />
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
};

export default InputComponent;
