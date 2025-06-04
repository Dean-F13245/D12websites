
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "€499",
      description: "Perfect for small businesses getting started online",
      features: [
        "5-page responsive website",
        "Basic logo design",
        "Contact form integration",
        "Mobile optimization",
        "1 year free hosting",
        "SSL certificate included",
        "Basic SEO setup",
        "2 rounds of revisions"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Plus",
      price: "€899",
      description: "Most popular choice for growing businesses",
      features: [
        "10-page responsive website",
        "Professional logo & branding",
        "Contact form & lead capture",
        "Mobile & tablet optimization",
        "1 year free hosting",
        "SSL certificate included",
        "Advanced SEO optimization",
        "Google Analytics setup",
        "Social media integration",
        "3 rounds of revisions",
        "3 months free updates"
      ],
      popular: true,
      cta: "Most Popular"
    },
    {
      name: "Pro",
      price: "€1,499",
      description: "Complete solution for established businesses",
      features: [
        "Unlimited pages",
        "Complete brand identity package",
        "Advanced contact forms",
        "E-commerce ready",
        "Mobile & tablet optimization",
        "1 year free hosting",
        "SSL certificate included",
        "Premium SEO optimization",
        "Google Analytics & Search Console",
        "Social media integration",
        "Blog setup",
        "Email marketing integration",
        "Unlimited revisions",
        "6 months free updates",
        "Priority support"
      ],
      popular: false,
      cta: "Go Premium"
    }
  ];

  const addOns = [
    {
      name: "Monthly Maintenance",
      price: "€99/month",
      description: "Keep your website updated and secure"
    },
    {
      name: "Additional Pages",
      price: "€75/page",
      description: "Add more pages to your existing website"
    },
    {
      name: "E-commerce Setup",
      price: "€299",
      description: "Add online store functionality"
    },
    {
      name: "Blog Setup",
      price: "€199",
      description: "Professional blog with CMS"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-900 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the perfect package for your business. All plans include hosting, SSL, and our commitment to your success.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-shadow duration-300 ${
                plan.popular ? 'border-brand-500 border-2 transform scale-105' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-brand-gradient text-white px-4 py-1 text-sm font-semibold">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-brand-600">{plan.price}</span>
                    <span className="text-gray-500 ml-1">one-time</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button 
                      className={`w-full font-semibold ${
                        plan.popular 
                          ? 'bg-brand-gradient hover:opacity-90 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Optional Add-ons
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enhance your website with these additional services available for all plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {addon.name}
                  </h3>
                  <div className="text-2xl font-bold text-brand-600 mb-3">
                    {addon.price}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {addon.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What's included in the hosting?
              </h3>
              <p className="text-gray-600">
                Your first year of hosting is completely free and includes SSL certificate, daily backups, 
                99.9% uptime guarantee, and technical support.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How long does it take to build my website?
              </h3>
              <p className="text-gray-600">
                Most websites are completed within 2-3 weeks from the initial consultation, 
                depending on the complexity and your feedback response time.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Can I update my website myself?
              </h3>
              <p className="text-gray-600">
                Yes! We provide training and documentation so you can make basic updates. 
                For complex changes, our monthly maintenance service is available.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Do you provide ongoing support?
              </h3>
              <p className="text-gray-600">
                All plans include initial support, and we offer monthly maintenance packages 
                for ongoing updates, security, and technical support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today for a free consultation and custom quote for your project.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
              Get Your Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
