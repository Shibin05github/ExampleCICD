// App.test.js or App.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders LoginScreen initially', () => {
    const { getByPlaceholderText, getByText } = render(<App />);

    // Ensure login elements are present
    expect(getByPlaceholderText('Enter username')).toBeTruthy();
    expect(getByPlaceholderText('Enter Password')).toBeTruthy();
    expect(getByText('LOGIN')).toBeTruthy();
  });

  it('displays an error message for empty login', () => {
    const { getByText } = render(<App />);

    // Trigger login without entering values
    fireEvent.press(getByText('LOGIN'));

    // Ensure error message is displayed
    expect(getByText('Please provide all values')).toBeTruthy();
  });

  it('displays a success message for correct login', () => {
    const { getByPlaceholderText, getByText } = render(<App />);

    // Enter correct username and password
    fireEvent.changeText(
      getByPlaceholderText('Enter username'),
      'codeb@gmail.com',
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter Password'),
      'Password@1234',
    );

    // Trigger login
    fireEvent.press(getByText('LOGIN'));

    // Ensure success message is displayed
    expect(getByText('CODEB')).toBeTruthy();
  });

  it('displays an error message for incorrect login', () => {
    const { getByPlaceholderText, getByText } = render(<App />);

    // Enter incorrect username and password
    fireEvent.changeText(
      getByPlaceholderText('Enter username'),
      'incorrect@gmail.com',
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter Password'),
      'IncorrectPassword',
    );

    // Trigger login
    fireEvent.press(getByText('LOGIN'));

    // Ensure error message is displayed
    expect(getByText('INCORRECT CREDENTIAL')).toBeTruthy();
  });
});
