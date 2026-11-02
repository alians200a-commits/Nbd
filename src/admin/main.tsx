import React from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './AdminApp';
import './styles.css';

const root = document.getElementById('admin-root');
if (root) createRoot(root).render(<React.StrictMode><AdminApp /></React.StrictMode>);
