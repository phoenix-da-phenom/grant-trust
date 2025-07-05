const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//Generate JWT TOKEN
const generateToken = (userId) => {
    return jwt.sign({
            id: userId
        },
        process.env.JWT_SECRET, {
            expiresIn: "7d"
        });


};

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = async(req, res) => {
    try {
        const { firstname, lastname, email, password, adminInviteToken, country, state, address, postalcode } = req.body;

        //check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //Determine user role: Admin if correct token is provided otherwise memeber
        let role = "member"
        if (
            adminInviteToken &&
            adminInviteToken === process.env.ADMIN_INVITE_TOKEN
        ) {
            role = "admin";
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role,
            country,
            state,
            postalcode,
            address

        });

        //Return user data with JWT
        res.status(201).json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            country: user.country,
            state: user.state,
            postalcode: user.postalcode,
            address: user.address,
            token: generateToken(user._id),

        });


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

//@desc Login User
//@route POST /api/auth/login
//@access Public
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: " Invalid email or password" });
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //Return user data with JWT
        res.json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

//@desc Get user profile
//@route GET /api/auth/profile
//@access Private (Requires JWT)
const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });

        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

//@DESC UPDATE USER PROFILE
//@route PUT / api/ auth /profile
//@access private (Require JWT)
const updateUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        user.country = req.body.country || user.country;
        user.state = req.body.state || user.state;
        user.address = req.body.address || user.address;
        user.postalcode = req.body.postalcode || user.postalcode;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            country: updatedUser.country,
            state: updatedUser.state,
            address: updatedUser.address,
            postalcode: updatedUser.postalcode,
            role: updatedUser.role,
            token: generateToken(updatedUser.id),



        });



    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

const logOut = async(req, res) => {
    // For JWT, client should remove the token from storage
    // Optionally, you can maintain a token blacklist

    // Clear any HTTP-only cookies if used
    res.clearCookie('jwt');

    res.status(200).json({
        message: 'Logged out successfully',
        // Optional: Include a timestamp if needed
        loggedOutAt: new Date().toISOString()
    });
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, logOut };