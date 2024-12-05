import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import Landing from './pages/Landing/Landing';

test('renders Landing page correctly', () => {
  render(
    <Landing />
  );

  // Check if the title is rendered
  const titleElement = screen.getByTestId('landing-title');
  expect(titleElement).toBeInTheDocument();

  // Check if the description is rendered
  const descriptionElement = screen.getByTestId('landing-description');
  expect(descriptionElement).toBeInTheDocument();

  // Check if the Sign In link is rendered
  const signInLink = screen.getByTestId('signin-link');
  expect(signInLink).toBeInTheDocument();

  // Check if the Get Started button is rendered
  const getStartedButton = screen.getByTestId('header-get-started-button');
  expect(getStartedButton).toBeInTheDocument();
});


