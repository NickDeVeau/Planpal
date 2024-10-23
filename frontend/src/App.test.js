import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Group 1: Invitation Entry Validation Scenarios
test('Scenario 1.1: Invitation Entry with Incorrect Username', () => {
  render(<App />);
  
  // Attempt to invite user with incorrect username
  fireEvent.change(screen.getByPlaceholderText(/Enter username or email/i), { target: { value: 'nonexistent_user' } });
  fireEvent.click(screen.getByText(/Send Invitation/i));
  expect(screen.getByText(/Username not found/i)).toBeInTheDocument();
});

test('Scenario 1.2: Invitation Entry with Incorrect Email Format', () => {
  render(<App />);

  // Attempt to invite user with incorrect email format
  fireEvent.change(screen.getByPlaceholderText(/Enter username or email/i), { target: { value: 'invalidemail@' } });
  fireEvent.click(screen.getByText(/Send Invitation/i));
  expect(screen.getByText(/Enter a valid email address/i)).toBeInTheDocument();
});

test('Scenario 1.3: Invitation Entry with Valid Email Format but Nonexistent User', () => {
  render(<App />);

  // Attempt to invite user with valid email format but nonexistent user
  fireEvent.change(screen.getByPlaceholderText(/Enter username or email/i), { target: { value: 'validemail@example.com' } });
  fireEvent.click(screen.getByText(/Send Invitation/i));
  expect(screen.getByText(/Username not found/i)).toBeInTheDocument();
});

// Group 2: Task Search and Deletion Scenarios
test('Scenario 2.1: Task Search and Deletion After Sign In', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Search for task and delete
  fireEvent.change(screen.getByPlaceholderText(/Search tasks/i), { target: { value: 'specific task' } });
  fireEvent.click(screen.getByText(/Search/i));
  fireEvent.click(screen.getByText(/Delete/i));
  expect(screen.queryByText(/specific task/i)).not.toBeInTheDocument();

  // Log out
  fireEvent.click(screen.getByText(/Log Out/i));
});

test('Scenario 2.2: Delete Task without Searching', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Delete task directly from overview
  fireEvent.click(screen.getByText(/Overview/i));
  fireEvent.click(screen.getByText(/Delete/i));
  expect(screen.queryByText(/specific task/i)).not.toBeInTheDocument();

  // Log out
  fireEvent.click(screen.getByText(/Log Out/i));
});

test('Scenario 2.3: Task Deletion After Logging In and Navigating to Search', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Navigate to search page, search for task and delete
  fireEvent.click(screen.getByText(/Search/i));
  fireEvent.change(screen.getByPlaceholderText(/Search tasks/i), { target: { value: 'specific task' } });
  fireEvent.click(screen.getByText(/Delete/i));
  expect(screen.queryByText(/specific task/i)).not.toBeInTheDocument();
});

// Group 3: Task Modification Scenarios
test('Scenario 3.1: Modify Task Name and Due Date', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Navigate to overview and select task to modify
  fireEvent.click(screen.getByText(/Overview/i));
  fireEvent.click(screen.getByText(/test task/i));
  fireEvent.click(screen.getByText(/Edit Task/i));

  // Modify task name and due date
  fireEvent.change(screen.getByPlaceholderText(/Task name/i), { target: { value: 'updated task' } });
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 5);
  fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: newDate.toISOString().split('T')[0] } });
  fireEvent.click(screen.getByText(/Save/i));

  // Confirm task was updated
  expect(screen.getByText(/updated task/i)).toBeInTheDocument();
  expect(screen.getByText(newDate.toISOString().split('T')[0])).toBeInTheDocument();
});

test('Scenario 3.2: Modify Task Priority', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Navigate to overview and select task to modify
  fireEvent.click(screen.getByText(/Overview/i));
  fireEvent.click(screen.getByText(/test task/i));
  fireEvent.click(screen.getByText(/Edit Task/i));

  // Modify task priority
  fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'Medium' } });
  fireEvent.click(screen.getByText(/Save/i));

  // Confirm task priority was updated
  expect(screen.getByText(/Priority: Medium/i)).toBeInTheDocument();
});

test('Scenario 3.3: Modify Task Description', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Navigate to overview and select task to modify
  fireEvent.click(screen.getByText(/Overview/i));
  fireEvent.click(screen.getByText(/test task/i));
  fireEvent.click(screen.getByText(/Edit Task/i));

  // Modify task description
  fireEvent.change(screen.getByPlaceholderText(/Task description/i), { target: { value: 'updated description' } });
  fireEvent.click(screen.getByText(/Save/i));

  // Confirm task description was updated
  expect(screen.getByText(/updated description/i)).toBeInTheDocument();
});

// Group 4: Reminder Modification Scenarios
test('Scenario 4.1: Modify Reminder Time', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Navigate to task with reminder and edit reminder settings
  fireEvent.click(screen.getByText(/Task List/i));
  fireEvent.click(screen.getByText(/task with reminder/i));
  fireEvent.click(screen.getByText(/Edit Task/i));

  // Modify reminder time
  fireEvent.change(screen.getByLabelText(/Reminder/i), { target: { value: '1 hour before' } });
  fireEvent.click(screen.getByText(/Save/i));

  // Confirm reminder time was updated
  expect(screen.getByText(/1 hour before/i)).toBeInTheDocument();
});

test('Scenario 4.2: Modify Notification Type', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Navigate to task with reminder and edit notification settings
  fireEvent.click(screen.getByText(/Task List/i));
  fireEvent.click(screen.getByText(/task with reminder/i));
  fireEvent.click(screen.getByText(/Edit Task/i));

  // Modify notification type
  fireEvent.change(screen.getByLabelText(/Notification/i), { target: { value: 'SMS' } });
  fireEvent.click(screen.getByText(/Save/i));

  // Confirm notification type was updated
  expect(screen.getByText(/SMS notification/i)).toBeInTheDocument();
});

test('Scenario 4.3: Modify Both Reminder and Notification', () => {
  render(<App />);

  // Sign in
  fireEvent.click(screen.getByText(/Sign In/i));
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  // Navigate to task with reminder and edit reminder and notification settings
  fireEvent.click(screen.getByText(/Task List/i));
  fireEvent.click(screen.getByText(/task with reminder/i));
  fireEvent.click(screen.getByText(/Edit Task/i));

  // Modify both reminder and notification settings
  fireEvent.change(screen.getByLabelText(/Reminder/i), { target: { value: '30 minutes before' } });
  fireEvent.change(screen.getByLabelText(/Notification/i), { target: { value: 'Push Notification' } });
  fireEvent.click(screen.getByText(/Save/i));

  // Confirm reminder and notification settings were updated
  expect(screen.getByText(/30 minutes before/i)).toBeInTheDocument();
  expect(screen.getByText(/Push Notification/i)).toBeInTheDocument();
});
