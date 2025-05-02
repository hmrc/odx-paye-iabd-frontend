import AppSelector from '.';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

jest.mock('../app/iabd', () => () => <div>IABD Component</div>);
jest.mock('../app/iabd/cookiePage', () => () => <div>Cookies Component</div>);
jest.mock('../app/iabd/AccessibilityPage', () => () => <div>Accessibility Component</div>);
jest.mock('../app/iabd/ErrorPage/errorMessage', () => () => <div>Error Message Component</div>);
jest.mock('../app/iabd//NoP45InfoPage/NoP45InfoPage', () => () => <div>No P45 Info Component</div>);
jest.mock('../app/iabd/NoP45InfoPage/NoP45PensionInfo', () => () => (
  <div>No P45 Pension Info Component</div>
));
jest.mock('../../components/HOC/ProtectedRoute', () => ({ component: Component }) => (
  <div>
    ProtectedRoute: <Component />
  </div>
));

describe('AppSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Redirects to / by default', async () => {
    render(
      <MemoryRouter>
        <AppSelector />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('IABD Component')).toBeInTheDocument();
    });
  });

  test('Renders protected routes with ProtectedRoute wrapper', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppSelector />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('ProtectedRoute:')).toBeInTheDocument();
    });

    expect(screen.getByText('IABD Component')).toBeInTheDocument();
  });
});
