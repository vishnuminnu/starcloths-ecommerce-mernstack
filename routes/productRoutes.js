import express from "express"
import { isAdmin, requireSinIn } from "../middlewares/authMiddleware.js"
import { brainTreePaymentController,  braintreeTokenController, createProductController, deleteProductController,  getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js"
import formidable from "express-formidable"

const router = express.Router()

//routes
router.post("/create-product",requireSinIn,isAdmin,formidable(),createProductController)

//routes
router.put("/update-product/:pid",requireSinIn,isAdmin,formidable(),updateProductController)

//getAll product 
router.get("/get-product",getProductController);

//single product 
router.get("/get-product/:slug",getSingleProductController);

//get photo 
router.get("/product-photo/:pid",productPhotoController);

//delete product
router.delete("/delete-product/:pid",deleteProductController);

//filter product
router.post("/product-filters",productFiltersController);

//product count

router.get("/product-count",productCountController);

//product per page
router.get("/product-list/:page",productListController);

//search product
router.get("/search/:keyword",searchProductController);

//similar product
router.get("/related-product/:pid/:cid",relatedProductController)

//category wise product
router.get("/product-category/:slug",productCategoryController )

//payment routes
//token
router.get("/braintree/token",braintreeTokenController)

//payments
router.post("/braintree/payment",requireSinIn,brainTreePaymentController)


export default router