import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaTrash, FaCheck, FaRegCircle, FaCheckCircle } from 'react-icons/fa';

const BoardDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [boardRes, todoRes] = await Promise.all([
                api.get(`/boards/${id}`),
                api.get(`/boards/${id}/todos`)
            ]);
            setBoard(boardRes.data);
            setTodos(todoRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            navigate('/');
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            const res = await api.post('/todos', { title, boardId: id });
            setTodos([...todos, res.data]);
            setTitle('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (todo) => {
        try {
            const status = todo.status === 'completed' ? 'pending' : 'completed';
            const res = await api.put(`/todos/${todo._id}`, { status });
            setTodos(todos.map(t => t._id === todo._id ? res.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (todoId) => {
        try {
            await api.delete(`/todos/${todoId}`);
            setTodos(todos.filter(t => t._id !== todoId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

    return (
        <div className="container">
            <button onClick={() => navigate('/')} className="btn-secondary" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaArrowLeft /> Back to Dashboard
            </button>

            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }} className="animate-fade-in">{board.title}</h1>
                {board.description && <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{board.description}</p>}
            </header>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a new task..."
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn-primary">
                        <FaPlus /> <span style={{ marginLeft: '0.5rem' }}>Add</span>
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                    {todos.map((todo) => (
                        <motion.div
                            key={todo._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                            className="glass-panel"
                            style={{
                                padding: '1rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: todo.status === 'completed' ? 'rgba(255,255,255,0.02)' : 'var(--glass)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                <button
                                    onClick={() => handleToggle(todo)}
                                    style={{
                                        background: 'none',
                                        color: todo.status === 'completed' ? 'var(--success)' : 'var(--text-secondary)',
                                        fontSize: '1.5rem',
                                        padding: 0
                                    }}
                                >
                                    {todo.status === 'completed' ? <FaCheckCircle /> : <FaRegCircle />}
                                </button>
                                <span style={{
                                    textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                                    color: todo.status === 'completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
                                    fontSize: '1.1rem'
                                }}>
                                    {todo.title}
                                </span>
                            </div>
                            <button onClick={() => handleDelete(todo._id)} className="btn-danger">
                                <FaTrash />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {todos.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                        No tasks yet. Add one above!
                    </p>
                )}
            </div>
        </div>
    );
};

export default BoardDetails;
