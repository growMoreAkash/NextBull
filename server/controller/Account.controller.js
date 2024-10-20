import Account from '../models/Account.model.js'; // Import the Account model
import User from '../models/User.model.js'; // Import the User model

export const createAccount = async (req, res) => {
    try {
        const { userId } = req.decode; // Extract userId from JWT token
        const { name, type, amount, currency } = req.body; // Destructure account details from request body

        // Validate required fields
        if (!name || !type || !amount || !currency) {
            return res.status(400).send("All fields (name, type, amount, and currency) are required");
        }

        // Create a new account
        const newAccount = new Account({
            name,
            type,
            balance: {
                amount,
                currency, // Use the destructured currency
            }
        });

        const savedAccount = await newAccount.save(); // Save the account to the database

        // Update the User model to link the created account
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { accountId: savedAccount._id },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        // Respond with the created account details and the updated user
        res.status(201).send({
            message: "Account created and linked to user successfully",
            account: savedAccount,
            user: updatedUser
        });
    } catch (error) {
        console.error("Error while creating account:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
};

export const updateAccountBalance = async (req, res) => {
    try {
        const { accountId } = req.params; // Get the accountId from the URL parameters
        const { amount, currency } = req.body; // Destructure amount and currency from the request body

        // Validate required fields
        if (!amount || (currency && typeof currency !== 'string')) {
            return res.status(400).send("Amount is required and currency must be a string");
        }

        // Find the account by ID
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }

        // Update the balance
        account.balance.amount = amount; // Update the amount
        if (currency) {
            account.balance.currency = currency; // Update the currency if provided
        }

        const updatedAccount = await account.save(); // Save the updated account

        // Respond with the updated account details
        res.status(200).send({
            message: "Account balance updated successfully",
            account: updatedAccount
        });
    } catch (error) {
        console.error("Error while updating account balance:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { accountId } = req.params; // Get the accountId from the URL parameters

        // Find the account by ID and delete it
        const account = await Account.findByIdAndDelete(accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }

        // Update the User model to remove the accountId
        await User.findOneAndUpdate(
            { accountId: accountId }, // Match user with the given accountId
            { accountId: null }, // Set accountId to null
            { new: true } // Return the updated user document
        );

        // Respond with a success message
        res.status(200).send({
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.error("Error while deleting account:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
};

