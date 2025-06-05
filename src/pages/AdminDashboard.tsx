import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, Users, LogOut, Plus, Pencil, Trash2, Receipt } from 'lucide-react';
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

const AdminDashboard = () => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    project_url: '',
    business_type: '',
    gallery_images: [] as string[],
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

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
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
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
            </nav>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-end">
              <Dialog open={showAddModal} onOpenChange={(open) => { setShowAddModal(open); if (!open) setEditId(null); }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" onClick={() => { setShowAddModal(true); setEditId(null); setForm({ title: '', description: '', project_url: '', business_type: '', gallery_images: [] }); setThumbnailFile(null); setGalleryFiles(null); }}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Portfolio Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</DialogTitle>
                    <DialogDescription>Fill in the details below to {editId ? 'edit' : 'add'} a portfolio item.</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleAddOrEditPortfolio}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thumbnail Image {editId && '(leave blank to keep current)'}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gallery Images (optional, multiple)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                      {galleryPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {galleryPreviews.map((src, i) => (
                            <img key={i} src={src} alt={`Preview ${i + 1}`} className="w-12 h-12 object-cover rounded border" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Type(s)</label>
                      <input
                        type="text"
                        name="business_type"
                        value={form.business_type}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border rounded px-3 py-2"
                        placeholder="e.g. Repair Store, Electrician, Brick Layer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project URL</label>
                      <input
                        type="text"
                        name="project_url"
                        value={form.project_url}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}
                    <DialogFooter>
                      <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {loading ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Item')}
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Total Portfolio Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{portfolioItems.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Active Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Pending Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </CardContent>
              </Card>
            </div>

            {/* Content Placeholder */}
            {activeTab === 'portfolio' ? (
              <Card>
                <CardContent className="p-6">
                  {portfolioItems.length === 0 ? (
                    <div className="text-center text-gray-500">
                      <p>No portfolio items yet. Click "Add Portfolio Item" to get started.</p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="portfolio-list">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {portfolioItems.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`flex items-center space-x-4 border-b pb-4 last:border-b-0 bg-white ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                    style={{ ...provided.draggableProps.style, cursor: 'grab' }}
                                  >
                                    {item.image_url && (
                                      <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded" />
                                    )}
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900">{item.title}</div>
                                      <div className="text-sm text-gray-600">{Array.isArray(item.business_type) ? item.business_type.join(', ') : item.business_type}</div>
                                    </div>
                                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-2" title="Edit">
                                      <Pencil className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-2" title="Delete">
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    <p>No clients yet. Click "Add Client" to get started.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard; 