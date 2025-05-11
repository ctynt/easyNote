import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import CategoryNotes from '@/pages/CategoryNotes';
import Notes from '@/pages/Notes';
import Note from '@/pages/Note';
import CreateNote from '@/pages/CreateNote';
import EditNote from '../pages/EditNote';
import Explore from '../pages/Explore';
import SharedNote from '@/pages/SharedNote';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/notes/categories/:categoryId" element={<CategoryNotes />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/notes/:id" element={<Note />} />
      <Route path="/notes/edit/:id" element={<EditNote />} />
      <Route path="/create-note" element={<CreateNote />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/shared/:encryptedId" element={<SharedNote />} />
    </Routes>
  );
};
export default AppRoutes;
