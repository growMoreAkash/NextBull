import express from "express";
import * as accountCont from "../controller/Account.controller.js"; // Import the account controller
import * as authMiddleware  from "../middleware/userMiddle.js"; // Import the authentication middleware

const accountRouter = express.Router();

// Route for creating a new account
accountRouter.route("/").post( accountCont.createAccount);

// Route for updating account balance
accountRouter.route("/:accountId").put(accountCont.updateAccountBalance);

// Route for deleting an account
accountRouter.route("/:accountId").delete( accountCont.deleteAccount);

// You can add more routes as needed

export { accountRouter };
