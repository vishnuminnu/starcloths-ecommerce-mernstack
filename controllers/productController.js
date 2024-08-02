import slugify from "slugify"
import productModel from "../models/productModel.js"
import fs from "fs";
import categoryModel from "../models/categoryModel.js"
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv"

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "bcdns3ks5kpwqt3m",
    publicKey: "mg5q6sr2dp345n4x",
    privateKey: "befdb24b8800cdb242d5920badfe2d8e",
  });

export const createProductController = async(req,res) => {
    try{
       const {name,slug,description,price,category,quantity,shipping} = req.fields
       const {photo} = req.files
       //validation
       switch(true){
        case !name:
            return res.status(500).send({error:"Name is Required"})
        case !description:
            return res.status(500).send({error:"description is Required"})
        case !price:
            return res.status(500).send({error:"Price is Required"})  
        case !category:
            return res.status(500).send({error:"Category is Required"})
        case !quantity:
            return res.status(500).send({error:"Quantity is Required"})
        case photo && photo.size > 1000000:
            return res.status(500).send({error:"Photo  is Required and should be less than 1 mb"})
       

       }
       const products = new productModel({...req.fields,slug:slugify(name)})
       if(photo){
        products.photo.data = fs.readFileSync(photo.path)
        products.photo.contentType=photo.type
       }
       await products.save()
       res.status(201).send({
        success:true,
        message:"Product Created Successfully",
        products,
       })
    }catch(error){
        console.log(error)
        res.send(500).send({
            success:false,
            error,
            message:"Error in creating product"
        })
    }
}

//get all products
export const getProductController = async(req,res)=>{
     try{
         const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1});
         res.status(200).send({
            success:true,
            counTotal:products.length,
            message:"All Products",
            products,
            
         });
     }catch(error){
        console.log(error)
        res.send(500).send({
            success:false,
            message:"Error in getting products",
            error:error.message
        })
     }
}

//get single product
export const getSingleProductController=async(req,res)=>{
     try{
        
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success:true,
            message:"Single product fetched",
            product,
        })
     }catch(error){
        console.log(error)
        res.status((500).send({
            success:false,
            message:"Error in getting single product",
            error,
        }))
     }
}

//get photo

export const productPhotoController= async(req,res)=>{
    try{
       const product = await productModel.findById(req.params.pid).select("photo")
       if(product.photo.data){
        res.set("content-type",product.photo.contentType)
        return res.status(200).send(product.photo.data)
       }

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting photo",
            error
        })
    }
}

//delete controller

export const deleteProductController=async(req,res)=>{
    try{
       await productModel.findByIdAndDelete(req.params.pid).select("-photo")
       res.status(200).send({
        success:true,
        message:"Product Deleted Successfully"
       })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:true,
            message:"Error while deleting product",
            error
        })
    }
}

//update product

export const updateProductController=async(req,res)=>{
    try{
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
        //validation
        switch(true){
         case !name:
             return res.status(500).send({error:"Name is Required"})
         case !description:
             return res.status(500).send({error:"description is Required"})
         case !price:
             return res.status(500).send({error:"Price is Required"})  
         case !category:
             return res.status(500).send({error:"Category is Required"})
         case !quantity:
             return res.status(500).send({error:"Quantity is Required"})
         case photo && photo.size > 1000000:
             return res.status(500).send({error:"Photo  is Required and should be less than 1 mb"})
        
 
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
        if(photo){
         products.photo.data = fs.readFileSync(photo.path)
         products.photo.contentType=photo.type
        }
        await products.save()
        res.status(201).send({
         success:true,
         message:"Product updated Successfully",
         products,
        })
     }catch(error){
         console.log(error)
         res.send(500).send({
             success:false,
             error,
             message:"Error in updating product"
         })
     }
}


//filters

export const productFiltersController=async(req,res)=>{
     try{
        const {checked,radio} = req.body
        let args = {}
        if(checked.length>0) args.category = checked
        if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success:true,
            products,
        })
     }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error While Filtering Products",
            error
        })
     }
};

export const productCountController=async(req,res)=>{
       try{
            const total = await productModel.find({}).estimatedDocumentCount()
            res.status(200).send({
                success:true,
                total,
            })
       }catch(error){
        console.log(error)
        res.status(400).send({
            message:"Error in product count",
            error,
            success:false
        })
       }
};

//product list base on page
export const productListController=async(req,res)=>{
    try{
        const perPage = 2;
        const page = req.params.page ? req.params.page :1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            products,
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:"error in per page ctrl",
            error,
        });
    }
}

//search product

export const searchProductController=async(req,res)=>{
    try{
        const {keyword} = req.params;
        const results = await productModel.find({
            $or:[
                {name:{$regex : keyword,$options:"i"}},
                {description:{$regex : keyword,$options:"i"}},
            ],
        }).select("-photo");
        res.json(results);
    }catch(error){
       console.log(error)
       res.status(400).send({
        success:false,
        message:"Error IN search product API",
        error,
       })
    }
}

//similar products

export const relatedProductController=async(req,res)=>{
      try{
          const {pid,cid} = req.params
          const products = await productModel.find({
             category:cid,
             _id:{$ne:pid},
          }).select("-photo").limit(3).populate("category");
          res.status(200).send({
            success:true,
            products,
          });
      }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error while getting related product",
            error
        })

      }
};



//get product by category
export const productCategoryController=async(req,res)=>{
         try{
               const category = await categoryModel.findOne({slug:req.params.slug})
               const products = await productModel.find({category}).populate("category")
               res.status(200).send({
                success:true,
                category,
                products,
               })
         }catch(error){
            console.log(error)
            res.status(400).send({
                success:false,
                error,
                message:"Error while getting products"
            })
         }
};

/// Token
export const braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          console.error('Error generating client token:', err);
          return res.status(500).send({ error: 'Failed to generate client token', details: err });
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.error('Unexpected server error:', error);
      res.status(500).send({ error: 'Unexpected server error', details: error });
    }
  };
  
  // Payment
  export const brainTreePaymentController = async (req, res) => {
    try {
      const { cart, nonce } = req.body;
      let total = 0;
      cart.forEach((i) => { total += i.price });
  
      gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: { submitForSettlement: true }
        },
        async function (error, result) {
          if (result) {
            await new orderModel({
              products: cart,
              payment: result,
              buyer: req.user._id
            }).save();
            res.json({ ok: true });
          } else {
            console.error('Error processing transaction:', error);
            res.status(500).send({ error: 'Transaction failed', details: error });
          }
        }
      );
    } catch (error) {
      console.error('Unexpected server error:', error);
      res.status(500).send({ error: 'Unexpected server error', details: error });
    }
  };
  