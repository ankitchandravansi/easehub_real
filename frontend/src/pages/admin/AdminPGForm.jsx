import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPG, getPGById, updatePG } from '../../services/services';
import { useAuth } from '../../context/AuthContext';

const AdminPGForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        rent: '',
        price: '', // Handling inconsistent naming if any
        gender: 'unisex',
        images: '',
        description: '',
        amenities: '',
        type: 'PG' // Default type
    });

    useEffect(() => {
        if (isEditMode) {
            fetchPGDetails();
        }
    }, [id]);

    const fetchPGDetails = async () => {
        try {
            const res = await getPGById(id);
            const data = res.data;

            // Map location object to flat fields if needed
            setFormData({
                name: data.name || '',
                address: data.location?.address || data.address || '',
                city: data.location?.city || data.city || '',
                rent: data.rent || data.price || '',
                price: data.rent || data.price || '',
                gender: data.gender || 'unisex',
                images: data.images ? data.images.join(', ') : '',
                description: data.description || '',
                amenities: data.amenities ? data.amenities.join(', ') : '',
                type: data.type || 'PG'
            });
        } catch (error) {
            console.error('Error fetching PG details', error);
            alert('Failed to fetch PG details');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload
            const payload = {
                name: formData.name,
                location: {
                    address: formData.address,
                    city: formData.city
                },
                rent: Number(formData.rent || formData.price), // backend expects rent or price? Schema says rent/price both usually. Let's send normalized.
                price: Number(formData.rent || formData.price),
                gender: formData.gender,
                description: formData.description,
                type: formData.type,
                images: formData.images.split(',').map(img => img.trim()).filter(img => img),
                amenities: formData.amenities.split(',').map(am => am.trim()).filter(am => am)
            };

            if (isEditMode) {
                await updatePG(id, payload);
                alert('PG updated successfully');
            } else {
                await createPG(payload);
                alert('PG created successfully');
            }
            navigate('/admin/pgs');
        } catch (error) {
            console.error('Error saving PG', error);
            alert(`Failed to ${isEditMode ? 'update' : 'create'} PG: ` + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-6">Loading details...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit PG' : 'Add New PG'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PG Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                        <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (₹)</label>
                        <input
                            type="number"
                            name="rent"
                            required
                            value={formData.rent}
                            onChange={(e) => setFormData({ ...formData, rent: e.target.value, price: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender Allowed</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="male">Boys</option>
                            <option value="female">Girls</option>
                            <option value="unisex">Co-living</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (comma separated)</label>
                        <textarea
                            name="images"
                            rows="2"
                            value={formData.images}
                            onChange={handleChange}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">First image will be the cover image.</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (comma separated)</label>
                        <textarea
                            name="amenities"
                            rows="2"
                            value={formData.amenities}
                            onChange={handleChange}
                            placeholder="WiFi, AC, Food, Laundry"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/pgs')}
                        className="mr-4 px-6 py-2 border rounded text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white font-bold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update PG' : 'Create PG')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPGForm;
