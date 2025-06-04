
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Palette, Smartphone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Index = () => {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Modern Web Design",
      description: "Responsive websites that look great on all devices and drive results for your business."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Custom Branding",
      description: "Professional logo design and brand identity that makes your business stand out."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast & Reliable",
      description: "Optimized websites with fast loading times and 99.9% uptime hosting included."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First",
      description: "Designed for mobile users first, ensuring perfect performance on all screen sizes."
    }
  ];

  const benefits = [
    "Professional website design",
    "Mobile-responsive layout",
    "SEO optimization included",
    "Free hosting for first year",
    "Monthly maintenance & updates",
    "24/7 customer support"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-brand-900 to-brand-800 text-white">
        <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Professional Websites for 
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dublin 12 Businesses
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                We create stunning, responsive websites that help small businesses grow online. 
                From design to hosting, we handle everything so you can focus on your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                    Let's Build Your Site
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-900 font-semibold px-8 py-3 text-lg">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-float hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl opacity-20 absolute inset-0 blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/30 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    <div className="h-24 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-white/20 rounded"></div>
                      <div className="h-16 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose D12 Websites?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine modern design with technical expertise to create websites that not only look great but perform exceptionally.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 animate-slide-up border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="text-brand-600 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed Online
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive web design packages include everything your business needs to establish a strong online presence and attract more customers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/pricing">
                  <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white font-semibold">
                    View Pricing Plans
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">
                  Join dozens of Dublin 12 businesses who trust us with their online presence.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Free consultation & quote</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>No hidden fees or contracts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Launch in 2-3 weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Business Online?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's create a website that represents your business professionally and drives real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-900 font-semibold px-8 py-3 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
