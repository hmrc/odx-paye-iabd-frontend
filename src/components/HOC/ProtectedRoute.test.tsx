import ProtectedRoute from './ProtectedRoute';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import {
  sdkIsLoggedIn,
  loginIfNecessary,
  getSdkConfig,
  sdkSetAuthHeader
} from '@pega/auth/lib/sdk-auth-manager';

// Authentication
jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn(() => Promise.resolve({ authConfig: {} })),
  loginIfNecessary: jest.fn(),
  sdkIsLoggedIn: jest.fn(),
  sdkSetAuthHeader: jest.fn()
}));

// React router dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
  useLocation: jest.fn(() => ({ pathname: '/' }))
}));

const MockComponent = () => <div>Mock landing</div>;

describe('ProtectedRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Redirects to login when user is not authenticated', async () => {
    (sdkIsLoggedIn as jest.Mock).mockReturnValue(false);
    (getSdkConfig as jest.Mock).mockResolvedValue({ authConfig: {} });

    render(
      <MemoryRouter>
        <ProtectedRoute component={MockComponent} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(loginIfNecessary).toHaveBeenCalledTimes(1);
    });
  });

  test('Renders landing when user is authenticated', async () => {
    (sdkIsLoggedIn as jest.Mock).mockReturnValue(true);

    render(
      <MemoryRouter>
        <ProtectedRoute component={MockComponent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Mock landing')).toBeInTheDocument();
    expect(loginIfNecessary).not.toHaveBeenCalled();
  });

  test('Handles Basic authentication type', async () => {
    (sdkIsLoggedIn as jest.Mock).mockReturnValue(false);
    (getSdkConfig as jest.Mock).mockResolvedValue({
      authConfig: {
        mashupClientId: null,
        customAuthType: 'Basic',
        mashupUserIdentifier: 'user',
        mashupPassword: window.btoa('password')
      }
    });

    render(
      <MemoryRouter>
        <ProtectedRoute component={MockComponent} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(sdkSetAuthHeader).toHaveBeenCalledWith(expect.stringContaining('Basic'));
    });
  });

  test('Handles BasicTO authentication type', async () => {
    (sdkIsLoggedIn as jest.Mock).mockReturnValue(false);
    (getSdkConfig as jest.Mock).mockResolvedValue({
      authConfig: {
        mashupClientId: null,
        customAuthType: 'BasicTO',
        mashupUserIdentifier: 'user',
        mashupPassword: window.btoa('password')
      }
    });

    render(
      <MemoryRouter>
        <ProtectedRoute component={MockComponent} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(sdkSetAuthHeader).toHaveBeenCalledWith(expect.stringContaining('Basic'));
    });
  });

  test('Calls onRedirectDone after login', async () => {
    (sdkIsLoggedIn as jest.Mock).mockReturnValue(false);
    (getSdkConfig as jest.Mock).mockResolvedValue({ authConfig: {} });

    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <ProtectedRoute component={MockComponent} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(loginIfNecessary).toHaveBeenCalledWith({
        appName: 'embedded',
        mainRedirect: true,
        redirectDoneCB: expect.any(Function)
      });
    });

    const redirectDoneCB = (loginIfNecessary as jest.Mock).mock.calls[0][0].redirectDoneCB;
    redirectDoneCB();

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
