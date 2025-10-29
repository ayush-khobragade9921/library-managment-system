const express = require("express");
const { users } = require('../data/user.json');
const router = express.Router();


/** 
 * Routes: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: None
*/
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    })
})

/** 
 * Routes: /users/:ID
 * Method: GET 
 * Description: Get user by ID
 * Access: Public
 * Parameters: ID
 */
router.get('/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each)=> each.id === id)

    if (!user) {
       return  res.status(404).json({ 
            success: false, 
            message: `User with ID ${id} not found`
         })
    }

    res.status(200).json({
        success: true,
        data: user
    })
})


/** 
 * Routes: /user
 * Method: POST
 * Description: Create a new user
 * Access: Public
 * Parameters: None
 */
router.post('/', (req, res) => {

 const {id, name, surname, email, suscriptionType, suscriptionDate} = req.body;
 if (!id || !name || !surname || !email || !suscriptionType || !suscriptionDate) {
    return res.status(400).json({
        success: false,
        message: "Please provide all the required fields"
    })
 }

  const user = users.find((each)=> each.id === id)
  if (user) {
    return res.status(400).json({
        success: false,
        message: `User with ID ${id} already exists`
    })
  }
    users.push({id, name, surname, email, suscriptionType, suscriptionDate});
    res.status(201).json({
        success: true,
        message: "User created successfully",
    })
})

/** 
 * Routes: /user/:id
 * Method: PUT
 * Description: Updating a user by ID
 * Access: Public
 * Parameters: ID
 */
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    //check if user exists
    const user = users.find((each)=> each.id === id)

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User with ID ${id} not found`
        })
    }

    const updatedUser = users.map((each) => {
        if (each.id === id) {
            return {...each, ...data};
        }
        return each;
    }); 

    res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully"
        
    })
})


/** 
 * Routes: /user/:id
 * Method: DELETE
 * Description: DELETING a user by ID
 * Access: Public
 * Parameters: ID
 */
router.delete('/:id', (req, res) => {
    const {id} = req.params;    

    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User with ID ${id} not found`
        });
    }

    const updatedUsers = users.filter((each) => each.id !== id);

    //another way to do the same
    // const index = users.findIndex((each) => each.id === id);
    // users.splice(index, 1);
    res.status(200).json({
        success: true,
        data: updatedUsers,
        message: "User deleted successfully"
    });
});

module.exports = router;