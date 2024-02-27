const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const userController = require('../controllers/user')

router.post('/add-new-user', userController.addUser)

router.post('/login', userController.loginUser )
router.get('/alive', async (req, res) => {
    res.send('App is alive. Ok');
})
router.put('/update-user', auth, userController.updateUser)
router.get('/get-users-by-tenant/:id', auth, userController.getUsersByTenant)


module.exports = router
