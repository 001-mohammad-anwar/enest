import express from "express"
import { registerUser, loginUser, getMyProfile , updateUserDetails} from "../controller/authController.js"
import { isAuthenticated } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser",isAuthenticated, getMyProfile);
router.put("/update-User", updateUserDetails);

export default router
