const Book = require("../models/book");
const supabase = require('../database/supabase');

async function handleFetchBook(req,res){
  try{
    const books = await Book.find({});
    res.status(200).json(books)
  } catch(err){
    console.log(`Error in fetching books : ${err}`)
    res.status(500).json({ error: 'Server error fetching books' });
  }
}

async function handleAddBook(req,res){
  try{
    const {title, author, description, publishDate, category} = req.body;
    const coverImage = req.files.coverImage[0];
    const pdfFile = req.files.pdfFile[0];

    if (!coverImage || !pdfFile) {
      return res.status(400).json({ error: 'Cover image and PDF file are required.' });
    }

    const savedBook = await Book.create({
      title,
      author,
      description,
      publishDate,
      category
    })

    const savedBookId = savedBook._id.toString();
    const coverImageExt = coverImage.originalname.split('.').pop(); //this will get the cover image extension(jpg/png/jpeg)
    const coverImagePath = `${savedBookId}/coverImage.${coverImageExt}`; 
    const pdfFilePath = `${savedBookId}/book.pdf`;

    const {error: imageError} = await supabase.storage
      .from('books')
      .upload(coverImagePath, coverImage.buffer, {
          contentType: coverImage.mimetype,
          upsert: false,
      });
    if(imageError) throw imageError;

    const {error: pdfError} = await supabase.storage
      .from('books')
      .upload(pdfFilePath, pdfFile.buffer, {
        contentType: pdfFile.mimetype,
        upsert: false,
      });
    if(pdfError) throw pdfError;

    const{ data: coverImageUrl } = await supabase.storage.from('books').getPublicUrl(coverImagePath);
    const{ data: pdfFileUrl } = await supabase.storage.from('books').getPublicUrl(pdfFilePath);

    savedBook.coverImageUrl = coverImageUrl.publicUrl;
    savedBook.pdfFileUrl = pdfFileUrl.publicUrl;
    await savedBook.save();

    return res.status(201).json({
      message: 'Book added successfully'
    })
  } catch(err){
    console.error('Error adding book:', err);
    return res.status(500).json({ error: 'Failed to add book.' });
  }
}

async function handleBookDetail(req,res){
  try{
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId)

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book)

  } catch(err){
    console.error('Error fetching book detail:', err);
    return res.status(500).json({ error: 'Failed to fetch book detail.' });
  }
   
}

module.exports = {
  handleFetchBook,
  handleAddBook,
  handleBookDetail
}