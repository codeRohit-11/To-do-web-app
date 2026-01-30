import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const res = await api.get('/boards');
            setBoards(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) handleLogout();
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/boards', { title, description });
            setTitle('');
            setDescription('');
            setShowForm(false);
            fetchBoards();
        } catch (err) {
            alert('Failed to create board');
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault(); // Prevent link click
        e.stopPropagation();
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/boards/${id}`);
            fetchBoards();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="animate-fade-in">Hi, {user?.email.split('@')[0]}</h1>
                <button onClick={handleLogout} className="btn-secondary">
                    <FaSignOutAlt style={{ marginRight: '0.5rem' }} /> Logout
                </button>
            </header>

            <div style={{ marginBottom: '2rem' }}>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary animate-fade-in">
                    <FaPlus style={{ marginRight: '0.5rem' }} /> New Board
                </button>
            </div>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreate}
                    className="glass-panel"
                    style={{ padding: '1.5rem', marginBottom: '2rem' }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            placeholder="Board Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            placeholder="Description (Optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Create</button>
                </motion.form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {boards.map((board, index) => (
                    <motion.div
                        key={board._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/board/${board._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', position: 'relative', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                    <button
                                        onClick={(e) => handleDelete(board._id, e)}
                                        className="btn-danger"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                <h3 style={{ marginBottom: '0.5rem', paddingRight: '2rem' }}>{board.title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{board.description}</p>
                                <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.6 }}>
                                    Created: {new Date(board.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            {boards.length === 0 && !showForm && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem' }}>
                    No boards yet. Create one to get started!
                </p>
            )}
        </div>
    );
};

export default Dashboard;
