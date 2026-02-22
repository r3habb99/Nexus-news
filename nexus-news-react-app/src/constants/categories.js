import { 
  Newspaper, 
  Zap, 
  Globe, 
  Briefcase, 
  Cpu, 
  PlayCircle, 
  Trophy, 
  HeartPulse, 
  FlaskConical, 
  Landmark,
  List
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'top', label: 'Latest', icon: <Newspaper size={18} />, description: 'Latest/top news' },
  { id: 'breaking', label: 'Breaking', icon: <Zap size={18} />, description: 'Breaking news' },
  { id: 'world', label: 'World', icon: <Globe size={18} />, description: 'World news' },
  { id: 'business', label: 'Business', icon: <Briefcase size={18} />, description: 'Business news' },
  { id: 'technology', label: 'Tech', icon: <Cpu size={18} />, description: 'Technology news' },
  { id: 'entertainment', label: 'Entertainment', icon: <PlayCircle size={18} />, description: 'Entertainment news' },
  { id: 'sports', label: 'Sports', icon: <Trophy size={18} />, description: 'Sports news' },
  { id: 'health', label: 'Health', icon: <HeartPulse size={18} />, description: 'Health news' },
  { id: 'science', label: 'Science', icon: <FlaskConical size={18} />, description: 'Science news' },
  { id: 'politics', label: 'Politics', icon: <Landmark size={18} />, description: 'Politics news' },
  { id: 'general', label: 'General', icon: <List size={18} />, description: 'General news' },
];

// Get category by id
export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[0];
};

// Get all category ids
export const getAllCategoryIds = () => {
  return CATEGORIES.map(cat => cat.id);
};
