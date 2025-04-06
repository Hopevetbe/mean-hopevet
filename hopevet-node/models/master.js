import mongoose from "mongoose";

const productGroupSchema = new mongoose.Schema(
    {
        groupName:{
            type: String,
            trim: true
        },
    }
);
const productBrandSchema = new mongoose.Schema(
    {
        brandName:{
            type: String,
            trim: true
        },
    }
);
const productPackSchema = new mongoose.Schema(
    {
        pack:{
            type: String,
            trim: true
        },
    }
);
const ProductGroup = mongoose.model('productGroup',productGroupSchema);
const ProductBrand = mongoose.model('productBrand',productBrandSchema);
const ProductPack = mongoose.model('productPack',productPackSchema);

export {ProductGroup,ProductBrand,ProductPack};