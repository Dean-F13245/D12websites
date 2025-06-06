import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { SEO } from '@/components/SEO';
import { useLocation } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    packageType: '',
    customRequest: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomRequest, setShowCustomRequest] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Use a small timeout to ensure the element is in the DOM and rendered
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 200); // Increased timeout
      }
    }
  }, [location]); // Re-run effect when location changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Show custom request field if "Other/Custom" is selected
    if (name === 'packageType') {
      setShowCustomRequest(value === 'other');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission to handle state updates and potentially show messages
    e.preventDefault();
    setIsSubmitting(true);

    // The form submission will be handled by the 'action' attribute directly.
    // We can optionally add a client-side success message here, but the form
    // submission service might handle redirects or provide a response.
    // For now, we'll just simulate success after a brief delay.

    // In a real implementation with a form service (like Formspree), you'd typically
    // rely on their handling of the POST request and potential redirect/response.
    // If using their AJAX features, you'd put the fetch logic here targeting their URL.

    // For direct form action submission, setIsSubmitting might be less useful
    // unless you handle an AJAX submission.
    // Let's assume for simplicity we are using the action attribute for submission
    // and will reset form/show message after submission (e.g., via redirect or AJAX response).

    // Reset form after submission is handled by the browser/service
    // This part might need adjustment based on how the form service handles response.
    // For now, we'll just reset locally after a short delay.
    setTimeout(() => {
        toast.success("Thank you! Your message has been sent.");
        setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            businessType: '',
            packageType: '',
            customRequest: '',
            message: ''
        });
        setShowCustomRequest(false);
        setIsSubmitting(false);
    }, 1000); // Simulate a brief delay before resetting form and showing success

    // The actual POST to the form service endpoint happens because of the form's action attribute
    // after e.preventDefault() is NOT called, or if you use their AJAX method.
    // Since we *are* calling e.preventDefault(), we would need to manually trigger the fetch
    // to the form service's AJAX endpoint here if they provide one.
    // If the form service relies purely on the action attribute, remove e.preventDefault().
    // Let's remove e.preventDefault() and the manual state reset/toast here for simplest action attribute usage.
    // The form service will handle the post and likely a redirect or thank you page.
  };

  // Let's revert handleSubmit to preventDefault but use a fetch to a form service endpoint
  // as this allows for client-side feedback (toast) and form reset without a page reload.
  // We will need to replace the fetch URL with the actual form service endpoint.

  const handleFormServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formServiceEndpoint = 'https://formspree.io/f/xovwvoqr'; // <<< Make sure this is your Formspree URL

    try {
      // Send data to Formspree
      const response = await fetch(formServiceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Formspree submission was successful
        toast.success("Thank you! We'll get back to you within 24 hours.");

        // Also save to Supabase
        const { error: supabaseError } = await supabase
          .from('contacts')
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company,
              message: formData.message,
              status: 'new'
            }
          ]);

        if (supabaseError) {
          console.error('Error saving to database:', supabaseError);
          // Optionally show a less critical error or log it if saving fails but email sent
        }

        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          businessType: '',
          packageType: '',
          customRequest: '',
          message: ''
        });
        setShowCustomRequest(false);
      } else {
        // Handle errors from the form service
        const errorData = await response.json();
        console.error('Form service submission error:', response.status, errorData);
        toast.error(errorData.error || "Something went wrong submitting your form. Please try again.");
      }
    } catch (error) {
      console.error('Fetch error during form submission:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8 text-brand-600" />,
      title: "Location",
      details: "Dublin 12, Ireland",
      subtext: "Serving all of Dublin & surrounding areas"
    },
    {
      icon: <Mail className="w-8 h-8 text-brand-600" />,
      title: "Email",
      details: "d12websites@gmail.com",
      subtext: "We'll respond within 24 hours"
    },
    {
      icon: <Clock className="w-8 h-8 text-brand-600" />,
      title: "Response Time",
      details: "Same Day",
      subtext: "Free consultation & quote"
    }
  ];

  const faqs = [
    {
      question: "How much does a website cost?",
      answer: "Our websites start from €200 for the Basic Package. The final cost depends on the chosen package (Basic or Full-Service) and any additional features or customizations."
    },
    {
      question: "How long does it take to build a website?",
      answer: "Most websites are completed within 1-2 weeks from the initial consultation, depending on the scope and your feedback response time."
    },
    {
      question: "Do you provide hosting and domain services?",
      answer: "The Full-Service Package includes hosting and SSL certificate. We can also take care of domain registration for you."
    },
    {
      question: "Will my website work on mobile devices?",
      answer: "Absolutely! All our websites are designed mobile-first and are fully responsive across all devices and screen sizes."
    }
  ];

  // Contact page structured data
  const contactStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact D12 Websites - Get a Free Quote',
    description: 'Contact D12 Websites for a free consultation and quote on your website design project. We serve businesses in Dublin 12 and surrounding areas.',
    url: 'https://d12websites.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'D12 Websites',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dublin 12',
        addressRegion: 'Dublin',
        addressCountry: 'IE'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@d12websites.com',
        availableLanguage: ['English']
      }
    },
    potentialAction: {
      '@type': 'ContactAction',
      name: 'Request a Quote',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://d12websites.com/contact',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform'
        ]
      }
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact Us - D12 Websites | Get a Free Website Design Quote"
        description="Contact D12 Websites for a free consultation and quote on your website design project. We serve businesses in Dublin 12 and surrounding areas."
        canonical="/contact"
        structuredData={contactStructuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-900 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ready to start your project? Contact us today for a free consultation and custom quote. 
            We're here to help bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300 shadow-md">
                <CardContent className="p-6 space-y-3">
                  <div className="text-brand-600 mb-2 flex justify-center">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {info.title}
                  </h3>
                  <p className="text-brand-600 font-medium">
                    {info.details}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {info.subtext}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader className="mb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Start Your Project
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Tell us about your project and we'll get back to you with a custom proposal.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormServiceSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessType">Type of Business</Label>
                      <Input
                        id="businessType"
                        name="businessType"
                        type="text"
                        placeholder="e.g., Restaurant, Retail, Construction"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="packageType">Package Type</Label>
                      <select
                        id="packageType"
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border rounded px-3 py-2 text-gray-700"
                      >
                        <option value="">Select a package</option>
                        <option value="basic">Basic Website Package (€200)</option>
                        <option value="full">Full-Service Package (€250 + €20/month)</option>
                        <option value="other">Other/Custom Request</option>
                      </select>
                    </div>

                    {showCustomRequest && (
                      <div>
                        <Label htmlFor="customRequest">Custom Request Details</Label>
                        <Textarea
                          id="customRequest"
                          name="customRequest"
                          value={formData.customRequest}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                          placeholder="Please describe your custom requirements..."
                          rows={3}
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 block w-full"
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <Send className="w-4 h-4 mr-2 animate-pulse" />
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Map (Logo) */}
            <div>
              <div className="space-y-8">
                {/* Logo instead of Map */}
                <Card className="shadow-xl h-64 lg:h-80 bg-white flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="D12 Websites Logo" 
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                </Card>
                {/* Additional Info - Keep or adjust as needed */}
                <Card className="shadow-xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-brand-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900">Our Location</div>
                        <div className="text-gray-700">Dublin 12, Ireland</div>
                        <div className="text-sm text-gray-600">Serving Dublin & surrounding areas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - integrate into layout or keep separate based on design */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - ensure consistent with other pages */}
       <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today for a free consultation and let's build something amazing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              Get a Free Quote
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
