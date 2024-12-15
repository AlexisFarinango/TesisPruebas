export const ToastMock = {
    show: jest.fn(),
};
jest.mock('react-native-toast-message', () => ToastMock);
