import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPGs, deletePG } from '../../services/pgService';

const AdminPGList = () => {
    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPGs = async () => {
        try {
            const res = await getAllPGs();
            const data = res.data.data || res.data || [];
            setPgs(data);
        } catch (error) {
            console.error("Error fetching PGs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPGs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this PG?")) {
            try {
                await deletePG(id);
                fetchPGs(); // Refresh
            } catch (error) {
                alert("Failed to delete PG");
                console.error(error);
            }
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage PGs</h1>
                <Link to="/admin/pgs/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Add New PG
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pgs.map((pg) => (
                            <tr key={pg._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={pg.images?.[0] || '/no-image.jpg'}
                                        alt=""
                                        className="h-10 w-10 rounded-full object-cover"
                                        onError={(e) => e.target.src = '/no-image.jpg'}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{pg.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{pg.location?.city}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{pg.rent}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/pgs/edit/${pg._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(pg._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPGList;
