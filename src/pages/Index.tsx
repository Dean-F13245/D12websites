import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Palette, Smartphone, Zap, Monitor, Code, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Index = () => {
  const features = [
    {
      icon: <Monitor className="w-10 h-10 text-blue-600" />,
      title: "Modern Web Design",
      description: "Responsive websites that look great on all devices and drive results for your business."
    },
    {
      icon: <Palette className="w-10 h-10 text-purple-600" />,
      title: "Custom Branding",
      description: "Professional logo design and brand identity that makes your business stand out."
    },
    {
      icon: <Zap className="w-10 h-10 text-green-500" />,
      title: "Fast & Reliable",
      description: "Optimized websites with fast loading times and 99.9% uptime hosting included."
    },
    {
      icon: <Smartphone className="w-10 h-10 text-red-500" />,
      title: "Mobile-First",
      description: "Designed for mobile users first, ensuring perfect performance on all screen sizes."
    }
  ];

  const benefits = [
    "Professional website design",
    "Mobile-responsive layout",
    "SEO optimization included",
    "Hassle Free Hosting",
    "Monthly maintenance & updates",
    "24/7 customer support"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-brand-900 to-brand-800 text-white py-24 lg:py-32">
        {/* Background decorative elements - simplified for cleaner look */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{backgroundImage: 'radial-gradient(#ffffff33 1px, transparent 1px), radial-gradient(#ffffff33 1px, transparent 1px)', backgroundSize: '30px 30px', backgroundPosition: '0 0, 15px 15px'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Affordable Websites for 
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Local Dublin Businesses
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg lg:max-w-none mx-auto lg:mx-0">
              I'm a Software Development college student passionate about helping local businesses grow by building modern, affordable websites tailored to their needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    Let's Build Your Site
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 text-lg transition-all duration-300 hover:-translate-y-0.5">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center animate-float">
              {/* Placeholder graphic for visual appeal */}
              <div className="relative w-full max-w-md">
                <div className="w-full h-64 bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-2xl shadow-2xl absolute inset-0 transform translate-x-4 translate-y-4 blur-xl opacity-50"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-white/30 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-24 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-lg flex items-center justify-center">
                    <Code className="w-10 h-10 text-white/70" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/20 rounded flex items-center justify-center">
                      <Layers className="w-8 h-8 text-white/70" />
                    </div>
                    <div className="h-20 bg-white/20 rounded flex items-center justify-center">
                      <Globe className="w-8 h-8 text-white/70" />
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
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 animate-slide-up border-0 shadow-md hover:-translate-y-1">
                <CardContent className="p-8 space-y-4">
                  <div className="text-transparent bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text mb-4 flex justify-center">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed Online
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive web design packages include everything your business needs to establish a strong online presence and attract more customers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/pricing">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg px-8 py-3 text-lg transition-all duration-300 hover:-translate-y-0.5">
                    View Pricing Plans
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl space-y-6">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">
                  Join dozens of Dublin 12 businesses who trust us with their online presence.
                </p>
                <div className="space-y-4 text-base">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                    <span>Free consultation & quote</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                    <span>No hidden fees or contracts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                    <span>Launch in 1-2 weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Online Presence?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's build a stunning website that attracts customers and helps your business thrive.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg px-8 py-3 text-lg transition-all duration-300 hover:-translate-y-0.5">
              Get a Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
