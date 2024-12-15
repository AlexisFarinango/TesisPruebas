import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../screens/Login.tsx'; // Ruta relativa del archivo Login.tsx
import mockedAxios from '../_mocks_/axios.ts';
import { ToastMock } from '../_mocks_/toast.ts';
import { AuthContext } from '../context/AuthContext';

describe('Login Component Tests', () => {
  const mockLogin = jest.fn();
  const mockSetNamedocente = jest.fn();

  const authContextValue = {
    login: mockLogin,
    setNamedocente: mockSetNamedocente,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );

    expect(getByPlaceholderText('Correo Institucional')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('Ingresar')).toBeTruthy();
  });

  test('shows error when fields are empty', () => {
    const { getByText } = render(
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText('Ingresar'));

    expect(ToastMock.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Lo sentimos, todos los campos deben de estar llenos',
      text2: 'Completa los campos',
    });
  });

  test('successful login for docente', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'mockedToken', nombre: 'John Doe' },
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Correo Institucional'), 'docente@test.com');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'docente123');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() => {
      expect(mockSetNamedocente).toHaveBeenCalledWith('John Doe');
      expect(mockLogin).toHaveBeenCalledWith('mockedToken');
    });
  });

  test('failed login for docente', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 401 },
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Correo Institucional'), 'docente@test.com');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'wrongpassword');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() => {
      expect(ToastMock.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Correo o contraseña Incorrecto',
      });
    });
  });
});
