'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../api/auth/context';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: number;
  title: string;
  content: string;
  visibility: string;
  created_at: string;
  updated_at: string;
}

interface NoteListProps {
  status: string;
  searchQuery: string;
  onNoteSelect: (note: Note) => void;
}

export default function NoteList({ status, searchQuery, onNoteSelect }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [status, searchQuery]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams();
      if (status && ['private', 'shared', 'public'].includes(status.toLowerCase())) {
        params.append('status', status.toLowerCase());
      }
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`http://127.0.0.1:8000/api/notes?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete note');
      }

      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No notes found. Create your first note!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onNoteSelect(note)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              note.visibility === 'public' ? 'bg-green-100 text-green-800' :
              note.visibility === 'private' ? 'bg-gray-100 text-gray-800' :
              note.visibility === 'shared' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {note.visibility}
            </span>
          </div>
          <div className="prose prose-sm max-h-32 overflow-hidden">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Last updated: {new Date(note.updated_at).toLocaleDateString()}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(note.id);
              }}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 