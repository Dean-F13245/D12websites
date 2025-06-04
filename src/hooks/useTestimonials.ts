
import { useQuery } from '@tanstack/react-query';
import { Testimonial } from '@/types/database';

// This will be replaced with actual Supabase client once connected
const fetchTestimonials = async (): Promise<Testimonial[]> => {
  // Placeholder - will be replaced with Supabase query
  console.log('Supabase not connected yet - returning empty array');
  return [];
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
  });
};

export const useFeaturedTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: async () => {
      const testimonials = await fetchTestimonials();
      return testimonials.filter(testimonial => testimonial.featured);
    },
  });
};
