
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - replace with actual Supabase integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Thank you! We'll get back to you within 24 hours.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: "Dublin 12, Ireland",
      subtext: "Serving all of Dublin & surrounding areas"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "+353 1 234 5678",
      subtext: "Mon-Fri 9am-6pm"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "hello@d12websites.ie",
      subtext: "We'll respond within 24 hours"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      details: "Same Day",
      subtext: "Free consultation & quote"
    }
  ];

  const faqs = [
    {
      question: "How much does a website cost?",
      answer: "Our websites start from €499 for a basic 5-page site. The final cost depends on your specific requirements, features, and design complexity."
    },
    {
      question: "How long does it take to build a website?",
      answer: "Most websites are completed within 2-3 weeks from the initial consultation, depending on the scope and your feedback response time."
    },
    {
      question: "Do you provide hosting and domain services?",
      answer: "Yes! All our packages include one year of free hosting and SSL certificate. We can also help you with domain registration and setup."
    },
    {
      question: "Will my website work on mobile devices?",
      answer: "Absolutely! All our websites are designed mobile-first and are fully responsive across all devices and screen sizes."
    }
  ];

  return (
    <Layout>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0">
                <CardContent className="p-6">
                  <div className="text-brand-600 mb-4 flex justify-center">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-brand-600 font-medium mb-1">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Start Your Project
                  </CardTitle>
                  <p className="text-gray-600">
                    Tell us about your project and we'll get back to you with a custom proposal.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          className="mt-1"
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
                          className="mt-1"
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
                          className="mt-1"
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
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectType">Project Type</Label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        >
                          <option value="">Select project type</option>
                          <option value="new-website">New Website</option>
                          <option value="website-redesign">Website Redesign</option>
                          <option value="ecommerce">E-commerce Store</option>
                          <option value="logo-branding">Logo & Branding</option>
                          <option value="maintenance">Website Maintenance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-500">Under €500</option>
                          <option value="500-1000">€500 - €1,000</option>
                          <option value="1000-2000">€1,000 - €2,000</option>
                          <option value="2000-plus">€2,000+</option>
                          <option value="discuss">Let's discuss</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Project Details *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project, goals, and any specific requirements..."
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-gradient hover:opacity-90 text-white font-semibold py-3 text-lg"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Why Choose Us */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose D12 Websites?
                </h2>
                <p className="text-gray-600 mb-6">
                As an independent Software Development student based in Dublin, I understand the challenges small businesses face. I'm not a big agency—I’m a local, just like you—so I treat every project with real care and attention.
                </p>

                <div className="space-y-4">
                  {[
                    "Free consultation & quote",
                    "2 week delivery window",
                    "Unique, modern designs - no using templates",
                    "Mobile-responsive design guaranteed",
                    "Ongoing support and maintenance",
                    "SEO optimized from day one"
                    
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the dozens of Dublin 12 businesses who trust us with their online presence.
          </p>
          <p className="text-lg text-blue-100">
            📞 Call us at <span className="font-semibold">+353 1 234 5678</span> or email{" "}
            <span className="font-semibold">hello@d12websites.ie</span>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
