import React, { useState, useEffect } from 'react'

export default function InventoryManager() {
  const [books, setBooks] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    cover: '',
    genre: 'Fiction'
  })

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/books')
      const data = await res.json()
      setBooks(data)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleAddBook = async (e) => {
    e.preventDefault()

    const res = await fetch('http://localhost:3001/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      alert('Book added successfully!')
      setFormData({
        title: '',
        author: '',
        price: '',
        cover: '',
        genre: 'Fiction'
      })
      fetchBooks()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book?')) {
      const res = await fetch(`http://localhost:3001/api/books/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setBooks(books.filter((book) => book._id !== id))
      }
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f5ef',
        padding: '50px',
        fontFamily: 'serif'
      }}
    >
      {/* Heading */}
      <div style={{ marginBottom: '40px' }}>
        <p
          style={{
            color: '#c89b3c',
            letterSpacing: '2px',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}
        >
          Admin Library Panel
        </p>

        <h1
          style={{
            fontSize: '56px',
            lineHeight: '1.1',
            color: '#1f1f2e',
            margin: '10px 0'
          }}
        >
          Inventory <br />
          <span
            style={{
              color: '#c89b3c',
              fontStyle: 'italic'
            }}
          >
            Management
          </span>
        </h1>

        <p
          style={{
            color: '#666',
            fontSize: '18px'
          }}
        >
          Add and remove books from your digital library
        </p>
      </div>

      {/* Add form */}
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: '50px'
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#1f1f2e' }}>
          Add New Book
        </h2>

        <form
          onSubmit={handleAddBook}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}
        >
          <input
            type="text"
            placeholder="Book Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            style={inputStyle}
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="Cover Image URL"
            value={formData.cover}
            onChange={(e) =>
              setFormData({ ...formData, cover: e.target.value })
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              gridColumn: 'span 2',
              padding: '14px',
              background: '#111122',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add to Library
          </button>
        </form>
      </div>

      {/* Existing books */}
      <h2 style={{ marginBottom: '20px', color: '#1f1f2e' }}>
        Existing Books
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}
      >
        {books.map((book) => (
          <div
            key={book._id}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '18px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{ color: '#1f1f2e' }}>{book.title}</h3>
            <p style={{ color: '#666' }}>{book.author}</p>
            <p style={{ margin: '12px 0' }}>₹{book.price}</p>

            <button
              onClick={() => handleDelete(book._id)}
              style={{
                padding: '10px 14px',
                border: '1px solid #c89b3c',
                borderRadius: '10px',
                background: 'white',
                color: '#c89b3c',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  fontSize: '15px',
  outline: 'none'
}