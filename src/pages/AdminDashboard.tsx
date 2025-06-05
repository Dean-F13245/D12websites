import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, Users, LogOut, Plus, Pencil, Trash2, Receipt, Mail } from 'lucide-react';
import Layout from '@/components/Layout';
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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    project_url: '',
    business_type: '',
    gallery_images: [] as string[],
  });
  const [clientForm, setClientForm] = useState({
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') return; // handled separately
    setForm({ ...form, [name]: value });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(e.target.files);
      // Preview selected images
      const filesArray = Array.from(e.target.files);
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setGalleryPreviews(previews);
      // Clear previous gallery_images in form (for new item)
      setForm((prev) => ({ ...prev, gallery_images: [] }));
    }
  };

  const uploadImage = async (file: File, pathPrefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  // Fetch portfolio items, ordered by sort_order then created_at
  const fetchPortfolioItems = async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error) setPortfolioItems(data || []);
  };

  // Add function to fetch contact submissions
  const fetchContactSubmissions = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact submissions:', error);
      // Optionally set an error state to display in the UI
    } else {
      setContactSubmissions(data || []);
    }
  };

  // Fetch clients function
  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false }); // Order by creation date descending

      if (error) throw error;
      setClients(data);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data based on active tab
    if (activeTab === 'portfolio') {
      fetchPortfolioItems();
    } else if (activeTab === 'clients') {
      fetchClients(); // Call fetchClients when clients tab is active
    } else if (activeTab === 'submissions') {
      fetchContactSubmissions();
    }
  }, [activeTab]); // Rerun effect when activeTab changes

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(portfolioItems);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    // Update sort_order locally
    const updated = reordered.map((item, idx) => ({ ...item, sort_order: idx }));
    setPortfolioItems(updated);
    // Update sort_order in Supabase
    for (const item of updated) {
      await supabase.from('portfolio_items').update({ sort_order: item.sort_order }).eq('id', item.id);
    }
  };

  const handleAddOrEditPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let imageUrl = '';
      let galleryUrls: string[] = [];
      // Upload thumbnail if selected
      if (thumbnailFile) {
        imageUrl = await uploadImage(thumbnailFile, 'thumbnail');
      }
      // Upload gallery images if selected
      if (galleryFiles && galleryFiles.length > 0) {
        const uploads = Array.from(galleryFiles).map((file, idx) => uploadImage(file, `gallery-${idx}`));
        galleryUrls = await Promise.all(uploads);
      }
      const payload = {
        title: form.title,
        description: form.description,
        image_url: imageUrl || (editId ? undefined : ''),
        project_url: form.project_url,
        business_type: form.business_type.split(',').map((t) => t.trim()),
        gallery_images: galleryUrls,
      };
      if (editId) {
        if (!imageUrl) delete payload.image_url;
        const { error } = await supabase.from('portfolio_items').update(payload).eq('id', editId);
        if (error) throw error;
        setSuccess('Portfolio item updated!');
      } else {
        payload.image_url = imageUrl;
        const { error } = await supabase.from('portfolio_items').insert([payload]);
        if (error) throw error;
        setSuccess('Portfolio item added!');
      }
      setForm({ title: '', description: '', project_url: '', business_type: '', gallery_images: [] });
      setThumbnailFile(null);
      setGalleryFiles(null);
      setGalleryPreviews([]);
      setShowAddModal(false);
      setEditId(null);
      await fetchPortfolioItems();
    } catch (err: any) {
      setError(err.message || 'Failed to save portfolio item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      title: item.title,
      description: item.description,
      project_url: item.project_url,
      business_type: Array.isArray(item.business_type) ? item.business_type.join(', ') : item.business_type,
      gallery_images: item.gallery_images || [],
    });
    setEditId(item.id);
    setShowAddModal(true);
    setThumbnailFile(null);
    setGalleryFiles(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      await fetchPortfolioItems();
    } catch (err: any) {
      alert(err.message || 'Failed to delete portfolio item');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for client form
  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientForm({ ...clientForm, [name]: value });
  };

  // Handle select change for client form
  const handleClientSelectChange = (name: string, value: string) => {
    setClientForm({ ...clientForm, [name]: value });
  };

  // Handle adding or editing a new client
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
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update(payload)
          .eq('id', editId);

        if (error) throw error;
        setSuccess('Client updated successfully!');

      } else {
        // Add new client
        const { data, error } = await supabase
          .from('clients')
          .insert([payload]);

        if (error) throw error;
        setSuccess('Client added successfully!');
      }

      // Reset form and close modal
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
      await fetchClients(); // Refresh the clients list

    } catch (err: any) {
      console.error('Error saving client:', err);
      setError(err.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a client
  const handleEditClient = (client: any) => {
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

  // Handle deleting a client
  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      await fetchClients(); // Refresh the clients list
    } catch (err: any) {
      console.error('Error deleting client:', err);
      alert(err.message || 'Failed to delete client');
    } finally {
      setLoading(false);
    }
  };

  // Filter clients by status for rendering
  const pendingClients = clients.filter(client => client.project_status === 'pending');
  const inProgressClients = clients.filter(client => client.project_status === 'in_progress');
  const completedClients = clients.filter(client => client.project_status === 'completed');

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {profile?.full_name || 'Admin'}
                </span>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs and Add Button Container */}
          <div className="border-b border-gray-200 mb-8 flex justify-between items-center">
            <nav className="-mb-px flex space-x-8">
              {/* Portfolio Tab */}
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`${
                  activeTab === 'portfolio'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <LayoutGrid className="w-5 h-5 mr-2" />
                Portfolio
              </button>
              {/* Clients Tab */}
              <button
                onClick={() => setActiveTab('clients')}
                className={`${
                  activeTab === 'clients'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Users className="w-5 h-5 mr-2" />
                Clients
              </button>
              {/* Invoices Tab */}
              <button
                onClick={() => navigate('/admin/invoices')}
                className={`${
                  activeTab === 'invoices'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Receipt className="w-5 h-5 mr-2" />
                Invoices
              </button>
              {/* Submissions Tab */}
              <button
                onClick={() => setActiveTab('submissions')}
                className={`${
                  activeTab === 'submissions'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Mail className="w-5 h-5 mr-2" />
                Submissions
              </button>
            </nav>
            {/* Add Button Container - Conditionally render DialogTriggers within their Dialogs */}            <div>
              {activeTab === 'portfolio' && (
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center" onClick={() => { setEditId(null); setForm({ title: '', description: '', project_url: '', business_type: '', gallery_images: [] }); setThumbnailFile(null); setGalleryFiles(null); }}>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Portfolio Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editId ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</DialogTitle>
                      <DialogDescription>
                        {editId ? 'Edit the details of the portfolio item.' : 'Fill in the details for a new portfolio item.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddOrEditPortfolio} className="grid gap-4 py-4">
                      {/* Portfolio Form Fields */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" name="title" value={form.title} onChange={handleInputChange} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" name="description" value={form.description} onChange={handleInputChange} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project_url" className="text-right">Project URL</Label>
                        <Input id="project_url" name="project_url" value={form.project_url} onChange={handleInputChange} className="col-span-3" type="url" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="business_type" className="text-right">Business Type / Tags (comma-separated)</Label>
                        <Input id="business_type" name="business_type" value={form.business_type} onChange={handleInputChange} className="col-span-3" placeholder="e.g. Restaurant, Retail, Construction" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="thumbnail" className="text-right">Thumbnail Image</Label>
                        <Input id="thumbnail" name="thumbnail" type="file" onChange={handleThumbnailChange} className="col-span-3" accept="image/*" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gallery" className="text-right">Gallery Images</Label>
                        <Input id="gallery" name="gallery" type="file" onChange={handleGalleryChange} className="col-span-3" accept="image/*" multiple />
                      </div>
                      {galleryPreviews.length > 0 && (
                        <div className="grid grid-cols-4 items-start gap-4">
                          <div className="col-span-1 text-right text-sm text-gray-700">Previews:</div>
                          <div className="col-span-3 flex flex-wrap gap-2">
                            {galleryPreviews.map((src, index) => (
                              <img key={index} src={src} alt={`Gallery preview ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                            ))}
                          </div>
                        </div>
                      )}
                    </form>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" form="add-portfolio-form" disabled={loading}>
                        {loading ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Portfolio Item')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {activeTab === 'clients' && (
                <Dialog open={showAddClientModal} onOpenChange={setShowAddClientModal}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center" onClick={() => setShowAddClientModal(true)}>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new client.
                      </DialogDescription>
                    </DialogHeader>
                    <form id="add-client-form" onSubmit={handleAddClient} className="grid gap-4 py-4">
                      {/* Client Form Fields */}
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
                        {loading ? 'Adding...' : 'Add Client'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Render content based on active tab */}
          {activeTab === 'portfolio' && (
            <>
              {/* Existing Portfolio Content (Drag and Drop context) */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="portfolioItems">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                      {portfolioItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                {item.project_url && (
                                  <a
                                    href={item.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-600 hover:underline text-sm mt-2 inline-block"
                                  >
                                    View Project
                                  </a>
                                )}
                                {item.business_type && Array.isArray(item.business_type) && item.business_type.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Tags: {item.business_type.join(', ')}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}

          {/* Submissions Section */}
          {activeTab === 'submissions' && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  {contactSubmissions.length === 0 ? (
                    <p>No contact submissions yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            {/* Add more headers if you included more fields in Supabase */}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contactSubmissions.map((submission) => (
                            <tr key={submission.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(submission.created_at).toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.phone || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.company || '-'}</td>
                              <td className="px-6 py-4 text-sm text-gray-500" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{submission.message}</td>
                              {/* Add more cells for additional fields */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Clients Section */}
          {activeTab === 'clients' && (
            <>
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
          )}

          {/* Invoices Section (assuming this exists) */}
          {activeTab === 'invoices' && (
            <div>
              {/* Your Invoices UI */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Invoice management UI goes here.</p>
                  {/* Example: List of invoices, Create Invoice button */}
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard; 