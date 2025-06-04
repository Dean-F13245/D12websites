
import { useQuery } from '@tanstack/react-query';
import { Project } from '@/types/database';

// This will be replaced with actual Supabase client once connected
const fetchProjects = async (): Promise<Project[]> => {
  // Placeholder - will be replaced with Supabase query
  console.log('Supabase not connected yet - returning empty array');
  return [];
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
};

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      const projects = await fetchProjects();
      return projects.filter(project => project.featured);
    },
  });
};
