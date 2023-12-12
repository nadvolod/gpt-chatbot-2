import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('handles input change', () => {
  render(<App />);
  const inputElement = screen.getByRole('textbox');
  fireEvent.change(inputElement, { target: { value: 'Hello' } });
  expect(inputElement.value).toBe('Hello');
});

test('handles form submission', async () => {
  render(<App />);
  const inputElement = screen.getByRole('textbox');
  const submitButton = screen.getByRole('button', { name: /submit/i });

  fireEvent.change(inputElement, { target: { value: 'Hello' } });
  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledWith(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  await waitFor(() => {
    const outputElement = screen.getByTestId('output');
    expect(outputElement.textContent).toBe('Response from OpenAI API');
  });
});

test('handles form submission error', async () => {
  axios.post.mockRejectedValueOnce({ response: { data: 'Error message' } });

  render(<App />);
  const inputElement = screen.getByRole('textbox');
  const submitButton = screen.getByRole('button', { name: /submit/i });

  fireEvent.change(inputElement, { target: { value: 'Hello' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    const outputElement = screen.getByTestId('output');
    expect(outputElement.textContent).toBe('Error: Could not retrieve response.');
  });
});