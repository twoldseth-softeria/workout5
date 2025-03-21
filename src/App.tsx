import './App.css';
import WorkoutList from './components/WorkoutList';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserProfile from './components/UserProfile';

const AppContent = () => {
  const { isLoading, isAuthenticated, error } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading user information...</div>;
  }

  if (!isAuthenticated) {
    return <div className="loading">Redirecting to login...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Workout Tracker</h1>
          <UserProfile />
        </div>
        <WorkoutList />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;