const { User } = require('../models')

const jwt = require('jsonwebtoken')

const Validator = require("fastest-validator");

const v = new Validator();

const bcrypt = require('bcrypt');

require('dotenv').config();
const {JWT_SECRET} = process.env


// CREATE USER (SIGNUP)
const signup = async (req, res, next) => {
    let {username, email, fullname, password, image, bio}= req.body
    // res.render('index', {title: 'Sign Up User'})

    // bcrypt.genSalt(10, function (err, salt) {
    //     bcrypt.hash(password, salt, function (err, hash) {
            
    //     })
    // })

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
        username,
        email,
        fullname,
        password : hashedPassword,
        bio,
        image,
        createdAt : new Date(),
        updatedAt : new Date(),
        createdBy : 0,
        updateBy : 0,
        isDeleted : false
    }


    const schema = {
        username : {type: 'string', min: 5, max:50, optional: false },
        email : {type:"email", optional: false },
        password : {type: 'string', min: 5, max:192, optional: false },
    };

  
    // VALIDASI EMAIL
    try {
        const findUniqeEmail = await User.findOne({
            where: {
                email
            }
        })
        
        if (findUniqeEmail) {
            // Email sudah digunakan
            return res.status(400).json({
                message : `Email ${findUniqeEmail.email} already exist`,
            })
          
        }else{
            // VALIDASI DATA
            const validasiResult = v.validate(data, schema)
    
            if (validasiResult !== true) {
                // Data tidak valid
                return res.status(400).json({
                    message : 'Validation Failed',
                    data : validasiResult
                })
            } else {
                // Create user jika belum di gunakan & data valid bisa di simpan
                try {
                    const userData = await User.create(data)
                    return res.status(200).json({message : 'Success', data: userData})
                } catch (error) {
                    return res.status(400).json({
                        message : 'Register Failed',
                        error : error
                    })
                }
            }        
        }
    } catch (error) {
        return res.status(400).json({
            message : 'Something wrong!',
            error : error
        })
    }
    
}
 
// READ USER
const read = async (req, res, next) => {
    // res.render('index', {title: 'Read User Data'})
    try {
        const userData = await User.findAll({
            where : {
                isDeleted : false
            }
        })
        return res.status(200).json(userData)
    } catch (error) {
        return res.status(200).json({
            error : error
        })
    }
}

// READ USER BY ID
const readByid = async (req, res, next) => {
    let {id} = req.params

    // res.render('index', {title: `Read User Data ID ${id} `})
    // try {
    //     const userData = await User.findAll({
    //         where : {
    //             id
    //         }
    //     })
    //     return res.status(200).json(userData)
    // } catch (error) {
    //     return res.status(200).json({
    //         error : error
    //     })
    // }
    try {
        const userData = await User.findByPk(id)
        return res.status(200).json(userData)
    } catch (error) {
        return res.status(200).json({
            error : error
        })
    }
}

// UPDATE USER 
const update = async (req, res, next) => {
    let {id} = req.params
    
    // res.render('index', {title: `Update User Data ID ${id} `})
    let {username, email, fullname, password, image, bio}= req.body
    // res.render('index', {title: 'Sign Up User'})
    const data = {
        username,
        email,
        fullname,
        password,
        bio,
        image,
        updatedAt : new Date(),
        updateBy : 0,
        isDeleted : false
    }

    const schema = {
        username : {type: 'string', min: 5, max:50, optional: false },
        email : {type:"email", optional: false },
        password : {type: 'string', min: 5, max:50, optional: false },
    };

    try {
    // VALIDASI DATA
    const validasiResult = v.validate(data, schema)
    
    if (validasiResult !== true) {
        // Data tidak valid
        return res.status(400).json({
            message : 'Validation Failed',
            data : validasiResult
        })
    } else {
        // Update user jika data valid bisa di simpan
       try {
        const userData = await User.update(data, {where : {id}} )
        return res.status(200).json({message : 'Success Update Data', data: userData})
       } catch (error) {
            return res.status(400).json({
                message : 'Update Failed',
                error : error
            })
        }
    }   
    } catch (error) {
        return res.status(400).json({
            message : 'Update Failed',
            error : error
        })
    }

    

    // try {
    //     const userData = await User.update(data, {where : {id}} )
    //     return res.status(200).json({message : 'Success Update Data', data: userData})
    // } catch (error) {
    //     return res.status(400).json({
    //         message : 'Update Failed',
    //         error : error
    //     })
    // }

}

// DELETE USER
const destroy = async (req, res, next) => {
    let {id} = req.params
    
    // res.render('index', {title: `Delete User Data ID ${id} `})

    // DELETE ROCORD
    // try {
    //     const userData = await User.destroy({where : {id}})
    //     return res.status(200).json({
    //         message : `Deleted data id ${id} success`,
    //         data: userData
    //     })
    // } catch (error) {
    //     return res.status(400).json({
    //         message : 'Deleted Failed',
    //         error : error
    //     })
    // }

    // SOFT DELETE
    const data = {
        isDeleted : true,
        deletedAt : new Date(),
        deletedBy : 1,
    }

    try {
        const userData = await User.update(data, {where : {id}} )
        return res.status(200).json({message : 'Success Delete Data', data: userData})
    } catch (error) {
        return res.status(400).json({
            message : 'Delete Failed',
            error : error
        })
    }

}

// LOGIN USER (SIGNIN)
const signin = async (req, res, next) => {
    let {username, email, fullname, password, image, bio}= req.body

    // res.render('index', {title: 'Sign In User'})
    try {
        const userData = await User.findOne({
            where : {
                email : email
            }
        })

        // console.log(userData.password);
        const validPassword = await bcrypt.compare(password, userData.password, function(err, result){
           

            if (result) {

                //Pembuatan token saat login
                const token = jwt.sign({
                    email : userData.email,
                    username : userData.username,
                    user_id : userData.id
                },JWT_SECRET, function (err, token) {  
                    return res.status(200).json({
                        message : 'Success login',
                        token: token,
                        data : userData
                    })      
                }  )
          
            } else {
                return res.status(401).json({
                    message : "Wrong Password",
                    data : err
                })
            }
        });

        if (userData) {
            if (userData.isDeleted === false) {
                validPassword
                // if (userData.password === password) {
                //     return res.status(200).json({
                //         message: 'Success',
                //         data : userData
                //     })
                // } else {
                //     return res.status(400).json({
                //         message : 'Wrong Password',
                //         data : userData
                //     })
                // }
            } else {
                return res.status(401).json({
                    message : 'User has been deleted',
                    data : userData
                })
            }
        } else {
            return res.status(401).json({
                message : 'Email not found',
                data : userData
            })
        }
    } catch (error) {
        return res.status(500).json({
                message : 'Login Failed',
                data : error 
            })
    }
}

module.exports = {
    signup, signin, 
    readByid, read,
    update, destroy,
}