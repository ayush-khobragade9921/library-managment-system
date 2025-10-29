const express = require("express");
const { books } = require('../data/books.json');
const {users} = require('../data/user.json');

const router = express.Router();

/** 
 * Routes: /books
 * Method: GET
 * Description: Get all books in the system
 * Access: Public
 * Parameters: None
*/
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    })
})

/** 
 * Routes: /books/:id
 * Method: GET
 * Description: Get a single book by ID
 * Access: Public
 * Parameters: id (path parameter)
*/
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const idNum = Number(id);
    const book = books.find((each) => Number(each.id) === idNum);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book with ID ${id} not found`
        });
    }
    res.status(200).json({
        success: true,
        data: book
    });
});

/** 
 * Routes: /books
 * Method: POST
 * Description: Add a new book to the system
 * Access: Public
 * Parameters: None
*/
router.post('/', (req, res) => {
    const { id, title, author, price, year } = req.body;
    if (!id || !title || !author || !price || !year) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    // Check for duplicate ID (normalize types)
    const numId = Number(id);
    if (Number.isNaN(numId)) {
        return res.status(400).json({ success: false, message: 'ID must be a number' });
    }
    const existingBook = books.find((each) => Number(each.id) === numId);
    if (existingBook) {
        return res.status(400).json({
            success: false,
            message: `Book with ID ${id} already exists`
        });
    }
    const newBook = {
        id: numId,
        title,
        author,
        price,
        year
    };
    books.push(newBook);
    res.status(201).json({
        success: true,
        data: newBook
    });
});



/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update a book by its id
 * Access: Public
 * Parameter: id
 */

router.put('/:id', (req, res)=> {
    const {id} = req.params;
    const {data} = req.body;


    const book = books.find((each)=>each.id === id)
    if(!book){
        return res.status(404).json({
            success: false,
            message:`Book not found for id: ${id}`
        })
    }

    const updatedBook = books.map((each)=>{
        if (each.id === id) {
            return {...each, ...data};
        }
        return each;
    });

    res.status(200).json({
        success: true,
        message: "Book Updated Successfully",
        data: updatedBook
    })

})

/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Delete a book by its id
 * Access: Public
 * Parameter: id
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id);
    
    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book not found for id: ${id}`
        });
    }

    const updatedBooks = books.filter((each) => each.id !== id);
    res.status(200).json({
        success: true,
        message: "Book Deleted Successfully",
        data: updatedBooks
    });
});

/** 
 * Routes: /books/issued/for-users
 * Method: GET
 * Description: Get all issued books with user details
 * Access: Public
 * Parameters: No
 */
router.get('/issued/for-users', (req, res) => {
    // Filter users who have issued books
    const usersWithIssuedBooks = users.filter((each) => (each.issuedBook));

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);
        
        // Only add the book if it was found
        if (book) {
            issuedBooks.push({
                ...book,
                issuedBy: each.name,
                issuedDate: each.issuedDate,
                returnDate: each.returnDate
            });
        }
    });

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No Books Issued"
        });
    }

    return res.status(200).json({
        success: true,
        data: issuedBooks
    });
});

/** 
 * Routes: /books/subscription-details/:id
 * Method: GET
 * Description: Get all the subscription details for a user
 * Access: Public
 * Parameters: id
 */
router.get('/subscription-details/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        });
    }

    const getDateInDays = (data = '') => {
        let date;
        if (data) {
            date = new Date(data);
        } else {
            date = new Date();
        }
        return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    };

    const getSubscriptionExpiration = (date) => {
        if (user.suscriptionType === "monthly") {
            return date + 30;
        } else if (user.suscriptionType === "annual") {
            return date + 365;
        } else if (user.suscriptionType === "trial") {
            return date + 7;
        }
        return date;
    };

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionStartDate = getDateInDays(user.suscriptionDate);
    let subscriptionExpiration = getSubscriptionExpiration(subscriptionStartDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForSubscription: subscriptionExpiration - currentDate,
        issuedBookStatus: user.issuedBook ? {
            daysLeftForReturn: returnDate - currentDate,
            returnStatus: returnDate < currentDate ? "Book return date has passed" : "Book return date not yet passed",
            fine: returnDate < currentDate ? (subscriptionExpiration <= currentDate ? 200 : 100) : 0
        } : "No book issued"
    }

    res.status(200).json({
        success: true,
        data: data
    });
});

module.exports = router;