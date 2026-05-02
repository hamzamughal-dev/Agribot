import Home from '../components/Home';
import { useUser } from '../context/UserContext';

const DashboardHome = () => {
  const { user } = useUser();
  return <Home user={user} />;
};

export default DashboardHome;
