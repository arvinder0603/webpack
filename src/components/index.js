import React from 'react';
import { createRoot } from 'react-dom/client';
import AppComponent from '@/components/App.js';

const root = createRoot(document.getElementById('root'));
root.render(<AppComponent />);