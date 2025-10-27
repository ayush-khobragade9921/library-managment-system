# library-managment-system
this is a library managment API Backend for the managment of user and the books 

# Routes and the Endpoints

# /users
GET: Get all the list of the users in the system
POST: Create/Register new user

## /users/{ID}
GET: Get user by their ID
PUT: Updating a user by their ID
DELET: Deleting a user by their ID (Check if the user still has an issued book) && {is their any fine/penalty to be collected}

## /user/suscription-details/{ID}
GET: Get user suscription details by their ID
>> Date of suscription
>> Vaild till ?
>> Fine if any ?

## /books
GET: Get all the books in the system
POST: Add new book to the system

## /books{ID}
GET: Get a book by its ID
PUT: Update a book by its ID
DELET: Delet a book by its ID

## /books/issued
GET: Get all the issued books

## /books/issued/withFine
GET: Get all issued books with their fine amount

### Suscription Type
  >> Basic    ( 3 Months )
  >> Standard ( 6 Months )
  >> Premium  ( 12 Months )

>> If user missed the renewal date, then user should be collected with $100
>> If user misses his suscription, then user is expected to pay $100
>> If user misses both renewal date and suscription then user expected to pay $200

## Command 
npm init
npm i express
npm i nodemon --save-dev

npm run dev