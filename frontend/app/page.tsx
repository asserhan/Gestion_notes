'use client';

import React, { useState } from 'react';
import { useAuth } from './api/auth/context';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';
import { Toaster } from 'react-hot-toast';

interface Note {
  id?: number;
  title: string;
  content: string;
  visibility: string;
}

export default function Home() {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setSelectedNote(undefined);
    setIsEditorOpen(false);
  };

  const handleSaveNote = () => {
    setIsEditorOpen(false);
    setSelectedNote(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-16 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-900">Notes App</h1>
            <button
              onClick={logout}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="pb-4">
            <div className="max-w-2xl mx-auto px-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search notes..."
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center space-x-4 mb-8">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Notes</option>
            <option value="private">Private</option>
            <option value="shared">Shared</option>
            <option value="public">Public</option>
          </select>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Note
          </button>
        </div>

        <NoteList
          status={status}
          searchQuery={searchQuery}
          onNoteSelect={handleNoteSelect}
        />
      </main>

      {isEditorOpen && (
        <NoteEditor
          note={selectedNote}
          onClose={handleCloseEditor}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
} 