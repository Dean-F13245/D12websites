import { useEffect, useState } from 'react';
import { ExternalLink, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import GalleryViewer from '@/components/GalleryViewer'; // Assuming you have or will create this component
import { SEO } from '@/components/SEO';

const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (!error) setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Open gallery modal
  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  // Close gallery modal
  const closeGallery = () => {
    setGalleryOpen(false);
    setGalleryImages([]);
    setGalleryIndex(0);
  };

  const testimonials = [
    // Add actual testimonials here
  ];

  const stats = [
    { number: "2+", label: "Websites Delivered" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "1-2", label: "Weeks Delivery" },
    { number: "24/7", label: "Support Available" }
  ];

  // Portfolio structured data
  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'D12 Websites Portfolio - Web Design Projects in Dublin 12',
    description: 'View our portfolio of professional website designs for Dublin 12 businesses. See examples of our custom web design, branding, and development work.',
    url: 'https://d12websites.com/portfolio',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'CreativeWork',
            name: 'Modern Restaurant Website',
            description: 'A responsive website design for a local Dublin 12 restaurant',
            image: 'https://d12websites.com/portfolio/restaurant.jpg',
            url: 'https://d12websites.com/portfolio/restaurant'
          }
        },
        // Add more portfolio items as needed
      ]
    }
  };

  return (
    <Layout>
      <SEO
        title="Portfolio - D12 Websites | Web Design Projects in Dublin 12"
        description="Explore our portfolio of professional website designs for Dublin 12 businesses. See examples of our custom web design, branding, and development work."
        canonical="/portfolio"
        structuredData={portfolioStructuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-900 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover the websites we've crafted for Local Dublin businesses. Each project reflects our commitment to quality design and functionality.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-4xl font-bold text-brand-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recent Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each website is custom-designed to reflect the unique personality and goals of our clients' businesses.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading...</div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={project.id || index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="relative overflow-hidden">
                    {project.image_url && (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    {/* Overlay for View Project button */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center p-4">
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <Button 
                            variant="secondary" 
                            size="lg"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                          >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            View Live Project
                          </Button>
                        </a>
                      )}
                       {project.gallery_images && project.gallery_images.length > 0 && (
                         <Button 
                           variant="secondary" 
                           size="lg"
                           className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100 shadow-lg ml-4"
                           onClick={() => openGallery(project.gallery_images, 0)}
                         >
                           <Eye className="w-5 h-5 mr-2" />
                           View Gallery
                         </Button>
                       )}
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.business_type)
                        ? project.business_type.map((type: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs font-medium bg-gray-200 text-gray-700">
                              {type.trim()}
                            </Badge>
                          ))
                        : null}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {project.description}
                    </p>
                    {/* Gallery previews removed from card to use modal */}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600">Portfolio projects will appear here once added through the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Design Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We follow a proven process to ensure every website meets our high standards and exceeds client expectations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We learn about your business, goals, and target audience to create the perfect strategy."
              },
              {
                step: "02",
                title: "Design",
                description: "Our team creates custom designs that reflect your brand and engage your customers."
              },
              {
                step: "03",
                title: "Development",
                description: "We build your website using modern technologies for optimal performance and security."
              },
              {
                step: "04",
                title: "Launch",
                description: "After thorough testing, we launch your website and provide training and ongoing support."
              }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Placeholder */}
      {testimonials.length > 0 && (
         <section className="py-20 bg-gray-50">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-4xl font-bold text-gray-900 mb-12">
               What Our Clients Say
             </h2>
             {/* Testimonial Carousel/Grid goes here */}
             {/* Example structure: */}
             {/* <Card>...</Card> */}
           </div>
         </section>
      )}

      {/* CTA Section */}
       <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Showcase Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's build a stunning portfolio or business website that attracts your ideal clients.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg transition-all duration-300 hover:-translate-y-0.5">
              Get a Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Gallery Viewer Modal */}
       <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
         <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
           {galleryOpen && (
              <GalleryViewer images={galleryImages} initialIndex={galleryIndex} onClose={closeGallery} />
           )}
         </DialogContent>
       </Dialog>
    </Layout>
  );
};

export default Portfolio;
