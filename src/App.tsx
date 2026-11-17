import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/authContext.tsx';
import AppRoutes from './routes/index.tsx';
import ErrorBoundary from './components/common/ErrorBoundary/index.tsx';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={4000} theme="dark" />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
