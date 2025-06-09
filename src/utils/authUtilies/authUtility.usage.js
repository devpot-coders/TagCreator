// pages/profile.js
import { isAuthenticated, handleLogout } from '../utils/authUtils';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      // Load user data
      apiClient.get('/profile')
        .then(response => setUser(response.data))
        .catch(() => handleLogout(() => router.push('/login')));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <button onClick={() => handleLogout(() => router.push('/login'))}>
        Logout
      </button>
    </div>
  );
}

// pages/login.js
export async function getServerSideProps(context) {
  const { redirectIfUnauthenticated } = require('../utils/authUtils');
  return redirectIfUnauthenticated(context, '/profile');
}