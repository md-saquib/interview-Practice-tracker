import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActivityForm from '../features/activities/components/ActivityForm.jsx';

// Wrap with MemoryRouter because ActivityForm uses useNavigate
function renderForm(props = {}) {
  return render(
    <MemoryRouter>
      <ActivityForm onSubmit={props.onSubmit ?? vi.fn()} {...props} />
    </MemoryRouter>
  );
}

// TC-011: renders without crash
describe('ActivityForm', () => {
  it('TC-011: renders title, date, category fields and submit button', () => {
    renderForm();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save activity/i })).toBeInTheDocument();
  });

  // TC-012: validation — empty title
  it('TC-012: shows "Title is required." when submitted with empty title', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /save activity/i }));
    expect(await screen.findByText('Title is required.')).toBeInTheDocument();
  });

  // TC-013: valid submission calls onSubmit
  it('TC-013: calls onSubmit with correct data for a valid form', () => {
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Practiced DP', name: 'title' },
    });
    // Date already pre-filled with today
    fireEvent.click(screen.getByRole('button', { name: /save activity/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
    const arg = onSubmit.mock.calls[0][0];
    expect(arg.title).toBe('Practiced DP');
    expect(arg.completed).toBeUndefined(); // completed not in form data
  });

  it('clears title error when user types in the field', async () => {
    renderForm();
    // Trigger error
    fireEvent.click(screen.getByRole('button', { name: /save activity/i }));
    expect(await screen.findByText('Title is required.')).toBeInTheDocument();

    // Type to clear
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New title', name: 'title' },
    });
    expect(screen.queryByText('Title is required.')).not.toBeInTheDocument();
  });

  it('renders pre-filled values in edit mode', () => {
    renderForm({
      initialValues: {
        title: 'Existing title',
        date: '2026-10-10',
        category: 'Frontend',
        notes: 'Some notes',
      },
      submitLabel: 'Update Activity',
    });
    expect(screen.getByDisplayValue('Existing title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Frontend')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update activity/i })).toBeInTheDocument();
  });
});
