import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/bookhub');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  price: Number,
  cover: String,
  description: String,
  rating: Number,
  reviews: Number
});

const Book = mongoose.model('Book', bookSchema);

const categories = ['Mystery', 'Sci-Fi', 'Fantasy', 'Thriller', 'Literary', 'Romance', 'Historical'];
const authors = ["Elena Sterling", "Marcus Finch", "Aura Vance", "Liam Kael", "Soren Veld", "Cora Blake", "J.R. Thorne", "Maya Lee"];

const generateBooks = () => {
  const books = [];
  let idCounter = 1;

  categories.forEach(genre => {
    for (let i = 1; i <= 5; i++) {
       // Using picsum.photos for 35 distinct, consistent aesthetic portrait images
       const coverUrl = `https://picsum.photos/seed/bookhub_${genre}_${i}/400/600`;
       
       books.push({
         title: `${genre} Masterpiece Vol ${i}`,
         author: authors[Math.floor(Math.random() * authors.length)],
         genre: genre,
         price: parseFloat((Math.random() * 20 + 5).toFixed(2)),
         cover: coverUrl,
         description: `A fascinating dive into the world of ${genre}. This is volume ${i} of our exclusive collection.`,
         rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
         reviews: Math.floor(Math.random() * 500) + 10
       });
       idCounter++;
    }
  });

  return books;
};

const seedDB = async () => {
  try {
    await Book.deleteMany({}); // Clears existing dataset
    const allBooks = generateBooks();
    await Book.insertMany(allBooks);
    console.log(`✅ successfully inserted ${allBooks.length} books with 35 UNIQUE HD COVERS!`);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
};

seedDB();