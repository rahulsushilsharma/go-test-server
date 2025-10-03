import { useEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

type Book = {
  id?: number;
  title: string;
  author: string;
};

const API_BASE = "https://android_server.rahulsharma.biz/api";

const BooksManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/books`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new book
  const addBook = async () => {
    if (!title || !author) return;
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
      });
      if (res.ok) {
        setTitle("");
        setAuthor("");
        fetchBooks();
      }
    } catch (err) {
      console.error("Error adding book", err);
    }
  };

  // Update a book
  const updateBook = async (book: Book) => {
    try {
      const res = await fetch(`${API_BASE}/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: book.title + " (Updated)",
          author: book.author,
        }),
      });
      if (res.ok) fetchBooks();
    } catch (err) {
      console.error("Error updating book", err);
    }
  };

  // Delete a book
  const deleteBook = async (id?: number) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
      if (res.ok) fetchBooks();
    } catch (err) {
      console.error("Error deleting book", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📚 Book Manager</h1>

      {/* Add Book Form */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button
          onClick={addBook}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Books List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {books.map((book) => (
            <li
              key={book.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateBook(book)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <BooksManager />
    </>
  );
}

export default App;
