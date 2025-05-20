'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

interface Note {
  id?: number;
  title: string;
  content: string;
  visibility: string;
}

interface NoteEditorProps {
  note?: Note | null;
  onClose: () => void;
  onSave: () => void;
}

export default function NoteEditor({ note, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setVisibility(note.visibility);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const noteData = {
        title,
        content,
        visibility,
      };

      const url = note?.id
        ? `http://127.0.0.1:8000/api/notes/${note.id}`
        : 'http://127.0.0.1:8000/api/notes';

      const response = await fetch(url, {
        method: note?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      toast.success(note?.id ? 'Note updated successfully' : 'Note created successfully');
      onSave();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="text-2xl font-semibold w-full bg-transparent border-none focus:outline-none focus:ring-0"
            />
            <div className="flex items-center space-x-2">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isPreview ? (
            <div className="prose max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full h-full min-h-[400px] p-4 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
            />
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 