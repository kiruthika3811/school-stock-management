import React, { useState } from 'react';
import { Download, Plus, Check } from 'lucide-react';
import databaseService from '../services/databaseService';

const BulkBookImport = ({ onClose, onImportComplete }) => {
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const externalBooks = [
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', quantity: 5 },
    { id: 2, title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'Fiction', quantity: 3 },
    { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', category: 'Romance', quantity: 4 },
    { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', quantity: 6 },
    { id: 5, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', isbn: '978-0-439-70818-8', category: 'Fantasy', quantity: 8 },
    { id: 6, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', category: 'Fiction', quantity: 2 },
    { id: 7, title: 'Lord of the Flies', author: 'William Golding', isbn: '978-0-571-05686-2', category: 'Fiction', quantity: 4 },
    { id: 8, title: 'Animal Farm', author: 'George Orwell', isbn: '978-0-452-28424-1', category: 'Fiction', quantity: 5 },
    { id: 9, title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0-547-92822-7', category: 'Fantasy', quantity: 7 },
    { id: 10, title: 'Jane Eyre', author: 'Charlotte Bronte', isbn: '978-0-14-144114-6', category: 'Romance', quantity: 3 }
  ];

  const handleSelectBook = (book) => {
    setSelectedBooks(prev => 
      prev.find(b => b.isbn === book.isbn)
        ? prev.filter(b => b.isbn !== book.isbn)
        : [...prev, book]
    );
  };

  const handleAddAll = async () => {
    setLoading(true);
    try {
      for (const book of externalBooks) {
        const { id, ...bookData } = book;
        await databaseService.addBook(bookData);
      }
      alert(`${externalBooks.length} books imported successfully!`);
      onImportComplete();
      onClose();
    } catch (error) {
      alert('Error adding all books');
    }
    setLoading(false);
  };

  const handleAddSelected = async () => {
    if (selectedBooks.length === 0) return;
    setLoading(true);
    try {
      for (const book of selectedBooks) {
        const { id, ...bookData } = book;
        await databaseService.addBook(bookData);
      }
      alert(`${selectedBooks.length} books imported successfully!`);
      onImportComplete();
      onClose();
    } catch (error) {
      alert('Error adding selected books');
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <h2 className="text-2xl font-bold mb-4">Import Books from External Source</h2>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={handleAddAll}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={20} />
            Add All Books ({externalBooks.length})
          </button>
          <button 
            onClick={handleAddSelected}
            disabled={loading || selectedBooks.length === 0}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Selected ({selectedBooks.length})
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {externalBooks.map((book) => (
            <div 
              key={book.isbn}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedBooks.find(b => b.isbn === book.isbn) 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectBook(book)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="text-sm text-gray-500">ISBN: {book.isbn} | Category: {book.category} | Qty: {book.quantity}</p>
                </div>
                {selectedBooks.find(b => b.isbn === book.isbn) && (
                  <Check className="text-blue-600" size={24} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkBookImport;