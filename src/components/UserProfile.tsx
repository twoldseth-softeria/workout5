import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <span className="user-profile__name">Welcome, {user.name}</span>
      <button 
        className="btn btn-sm btn-outline"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;