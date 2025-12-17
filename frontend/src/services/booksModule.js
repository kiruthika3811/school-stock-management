import databaseService from './databaseService';

/**
 * Books Module - Reusable functions for book management
 * Exports functions for managing all books and selected books
 */

// Book operations
export const booksModule = {
  // Get all books
  getAllBooks: () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = databaseService.subscribeToBooks((books) => {
        unsubscribe();
        resolve(books);
      });
    });
  },

  // Add new book
  addBook: async (bookData) => {
    return await databaseService.addBook(bookData);
  },

  // Update existing book
  updateBook: async (bookId, updates) => {
    return await databaseService.updateBook(bookId, updates);
  },

  // Delete book
  deleteBook: async (bookId) => {
    return await databaseService.deleteBook(bookId);
  },

  // Search books by criteria
  searchBooks: (books, searchTerm) => {
    return books.filter(book =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Filter books by category
  filterByCategory: (books, category) => {
    return books.filter(book => 
      book.category?.toLowerCase() === category.toLowerCase()
    );
  },

  // Get books by author
  getBooksByAuthor: (books, author) => {
    return books.filter(book => 
      book.author?.toLowerCase().includes(author.toLowerCase())
    );
  },

  // Get selected books (by IDs)
  getSelectedBooks: (books, selectedIds) => {
    return books.filter(book => selectedIds.includes(book.firebaseId));
  },

  // Export selected books data
  exportSelectedBooks: (selectedBooks) => {
    return selectedBooks.map(book => ({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      quantity: book.quantity
    }));
  },

  // Get book statistics
  getBookStats: (books) => {
    return {
      totalBooks: books.length,
      totalQuantity: books.reduce((sum, book) => sum + (book.quantity || 0), 0),
      categories: [...new Set(books.map(book => book.category).filter(Boolean))],
      authors: [...new Set(books.map(book => book.author).filter(Boolean))]
    };
  }
};

// Selected books operations
export const selectedBooksModule = {
  // Manage selected book IDs
  addToSelection: (selectedIds, bookId) => {
    return [...new Set([...selectedIds, bookId])];
  },

  removeFromSelection: (selectedIds, bookId) => {
    return selectedIds.filter(id => id !== bookId);
  },

  toggleSelection: (selectedIds, bookId) => {
    return selectedIds.includes(bookId) 
      ? selectedIds.filter(id => id !== bookId)
      : [...selectedIds, bookId];
  },

  selectAll: (books) => {
    return books.map(book => book.firebaseId);
  },

  clearSelection: () => {
    return [];
  },

  // Bulk operations on selected books
  bulkUpdateSelected: async (selectedIds, updates) => {
    const promises = selectedIds.map(id => 
      databaseService.updateBook(id, updates)
    );
    return await Promise.all(promises);
  },

  bulkDeleteSelected: async (selectedIds) => {
    const promises = selectedIds.map(id => 
      databaseService.deleteBook(id)
    );
    return await Promise.all(promises);
  }
};

// Default export combining both modules
export default {
  books: booksModule,
  selectedBooks: selectedBooksModule
};