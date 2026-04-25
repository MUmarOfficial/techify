import AuthProvider from './context/AuthContext';
import ToastProvider from './context/ToastContext';
import AppRouter from './routes/AppRouter';
import Toast from './components/ui/Toast';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
        <Toast />
      </ToastProvider>
    </AuthProvider>
  );
}
