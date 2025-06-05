import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientFormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  website_url: string;
  project_status: string;
  package_type: string;
  total_value: string;
  notes: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website_url: string | null;
  project_status: string;
  package_type: string;
  total_value: string | null;
  notes: string | null;
}

const ClientsManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clientForm, setClientForm] = useState<ClientFormState>({
    name: '',
    email: '',
    phone: '',
    website_url: '',
    project_status: 'pending',
    package_type: 'starter',
    total_value: '',
    notes: '',
    company: '',
  });
  const [editId, setEditId] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientForm({ ...clientForm, [name]: value });
  };

  const handleClientSelectChange = (name: string, value: string) => {
    setClientForm({ ...clientForm, [name]: value });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        name: clientForm.name,
        email: clientForm.email,
        phone: clientForm.phone,
        company: clientForm.company,
        website_url: clientForm.website_url,
        project_status: clientForm.project_status,
        package_type: clientForm.package_type,
        total_value: clientForm.total_value,
        notes: clientForm.notes,
      };

      if (editId) {
        const { error } = await supabase
          .from('clients')
          .update(payload)
          .eq('id', editId);
        if (error) throw error;
        setSuccess('Client updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('clients')
          .insert([payload]);
        if (error) throw error;
        setSuccess('Client added successfully!');
      }
      setClientForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        website_url: '',
        project_status: 'pending',
        package_type: 'starter',
        total_value: '',
        notes: '',
      });
      setEditId(null);
      setShowAddClientModal(false);
      fetchClients();
    } catch (err: any) {
      console.error('Error saving client:', err);
      setError(err.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setClientForm({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      website_url: client.website_url || '',
      project_status: client.project_status || 'pending',
      package_type: client.package_type || 'starter',
      total_value: client.total_value || '',
      notes: client.notes || '',
    });
    setEditId(client.id);
    setShowAddClientModal(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      fetchClients();
    } catch (err: any) {
      console.error('Error deleting client:', err);
      alert(err.message || 'Failed to delete client');
    } finally {
      setLoading(false);
    }
  };

  const pendingClients = clients.filter(client => client.project_status === 'pending');
  const inProgressClients = clients.filter(client => client.project_status === 'in_progress');
  const completedClients = clients.filter(client => client.project_status === 'completed');

  return (
    <>
      <Dialog open={showAddClientModal} onOpenChange={setShowAddClientModal}>
        <DialogTrigger asChild>
          <Button className="flex items-center" onClick={() => { setShowAddClientModal(true); setEditId(null); setClientForm({ name: '', email: '', phone: '', company: '', website_url: '', project_status: 'pending', package_type: 'starter', total_value: '', notes: '' }); }}>
            <Plus className="w-5 h-5 mr-2" />
            Add Client
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Edit the details of the client.' : 'Fill in the details for a new client.'}
            </DialogDescription>
          </DialogHeader>
          <form id="add-client-form" onSubmit={handleAddClient} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-name" className="text-right">Name</Label>
              <Input id="client-name" name="name" value={clientForm.name} onChange={handleClientInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-email" className="text-right">Email</Label>
              <Input id="client-email" name="email" value={clientForm.email} onChange={handleClientInputChange} className="col-span-3" type="email" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-phone" className="text-right">Phone</Label>
              <Input id="client-phone" name="phone" value={clientForm.phone} onChange={handleClientInputChange} className="col-span-3" type="tel" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-company" className="text-right">Company</Label>
              <Input id="client-company" name="company" value={clientForm.company} onChange={handleClientInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-website" className="text-right">Website</Label>
              <Input id="client-website" name="website_url" value={clientForm.website_url} onChange={handleClientInputChange} className="col-span-3" type="url" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-status" className="text-right">Status</Label>
              <Select onValueChange={(value) => handleClientSelectChange('project_status', value)} value={clientForm.project_status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-package" className="text-right">Plan/Package</Label>
              <Select onValueChange={(value) => handleClientSelectChange('package_type', value)} value={clientForm.package_type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="plus">Plus</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-value" className="text-right">Total Value</Label>
              <Input id="client-value" name="total_value" value={clientForm.total_value} onChange={handleClientInputChange} className="col-span-3" type="number" step="0.01" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-notes" className="text-right">Notes</Label>
              <Textarea id="client-notes" name="notes" value={clientForm.notes} onChange={handleClientInputChange} className="col-span-3" />
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="add-client-form" disabled={loading}>
              {loading ? (editId ? 'Save Changes' : 'Add Client') : (editId ? 'Save Changes' : 'Add Client')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {clients.length === 0 ? (
        <p>No clients yet. Click "Add Client" to get started.</p>
      ) : (
        <div className="space-y-8">
          {/* Pending Clients Section */}
          {pendingClients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit/Delete</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingClients.map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.company || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone || '-'}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${client.project_status === 'pending' ? 'text-yellow-600' : client.project_status === 'in_progress' ? 'text-blue-600' : client.project_status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>{client.project_status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.package_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClient(client)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* In Progress Clients Section */}
          {inProgressClients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>In Progress Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit/Delete</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inProgressClients.map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.company || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone || '-'}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${client.project_status === 'pending' ? 'text-yellow-600' : client.project_status === 'in_progress' ? 'text-blue-600' : client.project_status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>{client.project_status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.package_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClient(client)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Clients Section */}
          {completedClients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completed Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit/Delete</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedClients.map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.company || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone || '-'}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${client.project_status === 'pending' ? 'text-yellow-600' : client.project_status === 'in_progress' ? 'text-blue-600' : client.project_status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>{client.project_status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.package_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClient(client)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default ClientsManagement; 