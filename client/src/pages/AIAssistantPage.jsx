import AIAssistant from '../components/AIAssistant';
import { useUser } from '../context/UserContext';

const AIAssistantPage = () => {
  const { user } = useUser();
  return <AIAssistant user={user} />;
};

export default AIAssistantPage;
