import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { SEO } from '@/components/SEO';

const Pricing = () => {
  const plans = [
    {
      name: "Basic Website Package",
      price: "€200",
      description: "Perfect for businesses looking for a professional online presence",
      features: [
        { text: "Fully designed and built website", included: true },
        { text: "3 essential pages included:", included: true },
        { text: "• Homepage / About Us", included: true },
        { text: "• Products or Services Page", included: true },
        { text: "• Contact Page", included: true },
        { text: "No ongoing fees", included: true },
        { text: "Custom domain registration", included: false },
        { text: "Website hosting included", included: false },
       
      ],
      note: "You must purchase and manage your own domain and hosting separately",
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Full-Service Package",
      price: "€250",
      monthlyFee: "€20/month",
      description: "Complete solution with ongoing support and maintenance",
      features: [
        { text: "Fully designed and built website", included: true },
        { text: "3 essential pages included:", included: true },
        { text: "• Homepage / About Us", included: true },
        { text: "• Products or Services Page", included: true },
        { text: "• Contact Page", included: true },
        { text: "Custom domain registration", included: true },
        { text: "Website hosting included", included: true },
        { text: "Ongoing support and maintenance", included: true },
        
      ],
      note: "Includes €20/month upkeep fee for hosting, updates, and support",
      popular: true,
      cta: "Most Popular"
    }
  ];

  const addOns = [
    {
      name: "Monthly Maintenance",
      price: "Free",
      description: "Keep your website updated and secure"
    },
    {
      name: "Additional Pages",
      price: "€30/page",
      description: "Add more pages to your existing website"
    },
    {
      name: "Logo Design",
      price: "€30",
      description: "Create a professional logo for your business"
    },
    {
      name: "Social Media Integration",
      price: "€60",
      description: "Integrate your social media accounts into your website"
    }
  ];

  const faqs = [
    { question: "What's included in the hosting?", answer: "Hosting is completely managed by us and includes SSL certificate, daily backups, 99.9% uptime guarantee, and technical support." },
    { question: "How long does it take to build my website?", answer: "Most websites are completed within 1-2 weeks from the initial consultation, depending on the complexity and your feedback response time." },
    { question: "Can I update my website myself?", answer: "Yes! Once the website is completed, you will be provided with the entire source code." },
    { question: "Do you provide ongoing support?", answer: "All plans include support, and we offer monthly maintenance for ongoing updates, security, and technical support." },
    { question: "How can I pay?", answer: "We accept payment via Card (Stripe) and Revolut." }
  ];

  // Pricing structured data
  const pricingStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    name: 'D12 Websites Pricing Plans',
    description: 'Affordable website design packages for Dublin 12 businesses. Choose from Basic, Standard, and Premium plans with transparent pricing.',
    url: 'https://d12websites.com/pricing',
    offers: [
      {
        '@type': 'Offer',
        name: 'Basic Website Package',
        description: 'Professional website design for small businesses',
        price: '299',
        priceCurrency: 'EUR',
        priceValidUntil: '2024-12-31',
        availability: 'https://schema.org/InStock',
        includes: [
          'Responsive Website Design',
          'Basic SEO Setup',
          'Contact Form',
          'Social Media Integration',
          'Basic Hosting'
        ]
      },
      {
        '@type': 'Offer',
        name: 'Standard Website Package',
        description: 'Complete website solution with SEO and maintenance',
        price: '599',
        priceCurrency: 'EUR',
        priceValidUntil: '2024-12-31',
        availability: 'https://schema.org/InStock',
        includes: [
          'Everything in Basic Package',
          'Advanced SEO Optimization',
          'Content Management System',
          'Monthly Maintenance',
          'Premium Hosting',
          'Google Analytics Setup'
        ]
      },
      {
        '@type': 'Offer',
        name: 'Premium Website Package',
        description: 'Full-service website solution with custom features',
        price: '999',
        priceCurrency: 'EUR',
        priceValidUntil: '2024-12-31',
        availability: 'https://schema.org/InStock',
        includes: [
          'Everything in Standard Package',
          'Custom Features Development',
          'E-commerce Integration',
          'Priority Support',
          'Advanced Analytics',
          'Performance Optimization'
        ]
      }
    ]
  };

  return (
    <Layout>
      <SEO
        title="Website Design Pricing - D12 Websites | Affordable Packages for Dublin 12 Businesses"
        description="View our transparent website design pricing packages. Choose from Basic, Standard, and Premium plans tailored for Dublin 12 businesses. All packages include hosting and support."
        canonical="/pricing"
        structuredData={pricingStructuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-900 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the perfect package for your business. All websites are custom-designed and built with your success in mind.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-shadow duration-300 ${plan.popular ? 'border-brand-500 border-2 transform scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4 space-y-2">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-brand-600">{plan.price}</span>
                    <span className="text-gray-500 ml-1">starting price</span>
                    {plan.monthlyFee && (
                      <div className="mt-1 text-sm text-gray-600">
                        + {plan.monthlyFee} ongoing
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-gray-700 ${!feature.included ? 'text-gray-500 line-through' : ''}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {plan.note && (
                    <p className="text-sm text-gray-500 mb-6 italic">
                      {plan.note}
                    </p>
                  )}
                  <Link to="/contact">
                    <Button 
                      className={`w-full font-semibold px-8 py-3 text-lg transition-all duration-300 hover:-translate-y-0.5 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {addOns.map((addon, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 shadow-md">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
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

      {/* Additional Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need Something Custom?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            All packages can be customized to fit your specific needs. Contact us to discuss your requirements.
          </p>
          <Link to="/contact">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold px-8 py-3 transition-all duration-300 hover:-translate-y-0.5"
              size="lg"
            >
              Contact Us
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
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
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
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
          <Link to="/contact#contact-form">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg transition-all duration-300 hover:-translate-y-0.5">
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
