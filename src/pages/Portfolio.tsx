import { ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';

const Portfolio = () => {
  // This will be replaced with Supabase data fetching
  const projects = [];
  const testimonials = [];

  const stats = [
    { number: "50+", label: "Websites Delivered" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "2-3", label: "Weeks Delivery" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-900 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover the websites we've crafted for Dublin 12 businesses. Each project reflects our commitment to quality design and functionality.
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
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Project
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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

      {/* Process Section - keep existing code (process steps) */}
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
                <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-gray-600">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </div>
          
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.client_name}
                      </div>
                      <div className="text-brand-600 text-sm">
                        {testimonial.business}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Testimonials Yet</h3>
              <p className="text-gray-600">Client testimonials will appear here once added through the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - keep existing code (call to action) */}
      <section className="py-20 bg-brand-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's create a website that showcases your business and drives real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
              Start Your Project
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-900 font-semibold px-8 py-3 text-lg">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
