import React, { useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useFirebaseData } from '../hooks/useFirebaseData';
import databaseService from '../services/databaseService';
import BulkBookImport from '../components/BulkBookImport';

const Library = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({ 
    title: '', 
    author: '', 
    isbn: '', 
    category: '', 
    quantity: 1, 
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: books, loading, error } = useFirebaseData('books');

  const handleSave = async () => {
    try {
      if (editingBook) {
        await databaseService.updateBook(editingBook.firebaseId, {
          title: editingBook.title,
          author: editingBook.author,
          isbn: editingBook.isbn,
          category: editingBook.category,
          quantity: editingBook.quantity,
        });
      } else {
        await databaseService.addBook({
          title: newBook.title,
          author: newBook.author,
          isbn: newBook.isbn,
          category: newBook.category,
          quantity: parseInt(newBook.quantity) || 1,
        });
        setNewBook({ title: '', author: '', isbn: '', category: '', quantity: 1});
      }
      setShowModal(false);
      setEditingBook(null);
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Error saving book. Please try again.');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDelete = async (firebaseId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await databaseService.deleteBook(firebaseId);
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book. Please try again.');
      }
    }
  };

  const columnDefs = [
    { field: 'title', headerName: 'Title', flex: 2, sortable: true, filter: true },
    { field: 'author', headerName: 'Author', flex: 1, sortable: true, filter: true },
    { field: 'isbn', headerName: 'ISBN', flex: 1, sortable: true, filter: true },
    { field: 'category', headerName: 'Category', flex: 1, sortable: true, filter: true },
    { field: 'quantity', headerName: 'Total', width: 100, sortable: true },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params) => (
        <div className="flex gap-2 h-full items-center">
          <button onClick={() => handleEdit(params.data)} className="text-primary hover:text-primary/80">
            Edit
          </button>
          <button onClick={() => handleDelete(params.data.firebaseId)} className="text-red-600 hover:text-red-700">
            Delete
          </button>
        </div>
      ),
      sortable: false,
      filter: false
    }
  ];

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Library Management</h1>
          <p className="text-gray-500">Manage books and library resources</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkImport(true)} className="btn-secondary flex items-center gap-2">
            <Download size={20} />
            Import Books
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add New Book
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8">Loading books...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">Error loading books: {error.message}</div>
        ) : (
          <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
            <AgGridReact
              rowData={filteredBooks}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true
              }}
              suppressRowClickSelection={true}
            />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="Enter book title" 
                  value={editingBook ? editingBook.title : newBook.title} 
                  onChange={(e) => editingBook ? setEditingBook({...editingBook, title: e.target.value}) : setNewBook({...newBook, title: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input 
                  type="text" 
                  placeholder="Enter author name" 
                  value={editingBook ? editingBook.author : newBook.author} 
                  onChange={(e) => editingBook ? setEditingBook({...editingBook, author: e.target.value}) : setNewBook({...newBook, author: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">ISBN</label>
                <input 
                  type="text" 
                  placeholder="Enter ISBN" 
                  value={editingBook ? editingBook.isbn : newBook.isbn} 
                  onChange={(e) => editingBook ? setEditingBook({...editingBook, isbn: e.target.value}) : setNewBook({...newBook, isbn: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input 
                  type="text" 
                  placeholder="e.g., Fiction, Science, History" 
                  value={editingBook ? editingBook.category : newBook.category} 
                  onChange={(e) => editingBook ? setEditingBook({...editingBook, category: e.target.value}) : setNewBook({...newBook, category: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Quantity</label>
                <input 
                  type="number" 
                  placeholder="Enter total quantity" 
                  value={editingBook ? editingBook.quantity : newBook.quantity} 
                  onChange={(e) => editingBook ? setEditingBook({...editingBook, quantity: parseInt(e.target.value)}) : setNewBook({...newBook, quantity: parseInt(e.target.value)})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>
              
              
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 btn-primary">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showBulkImport && (
        <BulkBookImport 
          onClose={() => setShowBulkImport(false)}
          onImportComplete={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default Library;