import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import JWT from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen';

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

export const sendEmail = async (req, res) => {
    try {
        // const { userId } = req.decode;
        const { email } = req.body;
        if (!email) return res.status(400).send("Email is required");

        const currentDate = new Date();

        // Generate a 6-digit OTP
        const emailOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const mailGenerator = new Mailgen({
            theme: 'neopolitan',
            product: {
                name: 'NextBull',
                link: 'https://nextbull.in/' // Replace with your app's link
            }
        });

        const emailDetails = {
            body: {
                intro: `Your OTP is: ${emailOtp}`,
                action: {
                    instructions: 'Please use the OTP to verify your email address.',
                    button: {
                        color: '#22BC66',
                        text: 'Confirm Your Account',
                        link: 'https://yourapp.com/verify' // Replace with your verification link
                    }
                },
                outro: "If you have any questions, feel free to reply to this email."
            }
        };

        const emailBody = mailGenerator.generate(emailDetails);

        // Set up Nodemailer for sending the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL,
                pass: config.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"NEXTBULL" <${config.EMAIL}>`,
            to: email,
            subject: 'Verify Your Email Address',
            html: emailBody
        };

        await transporter.sendMail(mailOptions);

        // Hash the OTP
        const hashedOTP = await bcrypt.hash(emailOtp, 10);

        // Update or create the user with the OTP
        const updateUser = await User.updateOne(
            { email: email },
            {
                emailOtp: hashedOTP,
                otpExpiresAt: currentDate,
                $push: { requested: { apiUrl: '/sendEmail', date: currentDate } }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (!updateUser) return res.status(500).send("Failed to update user information");

        res.status(200).send({ message: "OTP sent to " + email });
    } catch (error) {
        console.error("Error while sending email:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { emailOtp, email } = req.body;

        if (!emailOtp || !email) {
            return res.status(400).send("Both email and OTP are required");
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Check if the OTP exists in the database
        if (!user.emailOtp) {
            return res.status(400).send("No OTP has been generated for this user");
        }

        const isOtpValid = await bcrypt.compare(emailOtp, user.emailOtp);
        if (!isOtpValid) {
            return res.status(400).send("Invalid OTP");
        }

        user.emailVerified = true;
        user.requsted.push({ apiUrl: '/verifyEmail', date: new Date() });
        await user.save();

        // Generate a JWT token
        const token = JWT.sign(
            { userId: user._id, email: user.email },
            config.JWT_SECRET, // Your JWT secret key
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token in the response
        res.status(200).send({ message: "Email verified successfully", token });
    } catch (error) {
        console.error("Error while verifying email:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
};

export const forgetPassword = async (req, res) => {
    //sendEmail (otp verify)
    //verifyOtp

    try {
        const { userId } = req.decode
        const { password } = req.body;
        if (!password) return res.status(404).send("PAss not found")


        const newPassword = await User.updateOne({ _id: userId }, { password })
        if (!newPassword) return res.status(404).send("Error while forget password")

        return res.status(200).send("password has been updated")
    } catch (error) {
        return res.status(404).send("Error " + error)
    }

}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.decode; // Assuming userId is extracted from a decoded JWT token
        const { name } = req.body;

        // Validate the name field
        if (!name) {
            return res.status(400).send("Name is required");
        }

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        // Respond with the updated user details
        res.status(200).send({ message: "User name updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error while updating user name:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
};