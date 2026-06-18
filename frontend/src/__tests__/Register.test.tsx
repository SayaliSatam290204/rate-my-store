import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Register } from '../pages/auth/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../hooks/useToast';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('Register Page Component', () => {
  it('renders registration form', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation error when name is too short', async () => {
    renderComponent();
    
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'Short Name' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 20 characters/i)).toBeInTheDocument();
    });
  });
});
