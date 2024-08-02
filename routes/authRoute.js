import express from "express"
import {forgotPasswordController, getAllOrderController, getOrderController, loginController, registerController, testController, updateProfileController} from "../controllers/authController.js";
import { isAdmin, requireSinIn } from "../middlewares/authMiddleware.js";


//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register",registerController);

//LOGI||POST
router.post("/login",loginController);

//Forgot Password || POST
router.post("/forgot-password",forgotPasswordController)

//text routes
router.get("/test",requireSinIn,isAdmin,testController);

//protected route user auth
router.get("/user-auth",requireSinIn,(req,res)=>{
    res.status(200).send({ok:true});
})

//protected route admin auth
router.get("/admin-auth",requireSinIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

//update profile
router.put("/profile",requireSinIn,updateProfileController)


//orders
router.get("/orders",requireSinIn,getOrderController)

//auth orders
router.get("/all-orders",requireSinIn,isAdmin,getAllOrderController)

export default router