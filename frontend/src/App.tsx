import { useState } from 'react';
import type { User } from './types';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return user ? <Dashboard user={user} /> : <Login onLogin={setUser} />;
}

export default App;
