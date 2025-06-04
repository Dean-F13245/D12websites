import React from 'react';
import Layout from '@/components/Layout';
import CreateInvoiceForm from '@/components/admin/CreateInvoiceForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AdminInvoices = () => {
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated and not loading
  if (!loading && !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Show loading state while checking auth
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Only show content if authenticated
  if (user) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Invoice Management</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <CreateInvoiceForm />
            </div>
            <div>
              {/* Invoice List will go here */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Invoice list and management features will be added here.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return null; // Should not reach here if logic is correct
};

export default AdminInvoices; 