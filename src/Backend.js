import { upload } from "@testing-library/user-event/dist/upload";
import { supabase } from "./connection";

const AddProduct = async (product) => {
    const addedProduct = await supabase
        .from("products")
        .insert({
            name: product.name,
            price: product.price,
            categoryId: product.category.id,
            typeId: product.type.id,
            description: product.description
        })
    console.log("added: ", addedProduct)
    for (let img of product.images) {

        await supabase
            .storage
            .from('products')
            .upload(img.name, img)

        const { publicURL, error } = supabase
            .storage
            .from('products')
            .getPublicUrl(img.name)

        await supabase
            .from("product_images")
            .insert({
                productId: addedProduct.data[0].id,
                src: publicURL
            })

    }

}

const AddImage = async (productId, src) => {
    const added = await supabase.from("product_images").insert({ productId, src })
    return added;
}

const DeleteImage = async (id) => {
    const deleted = await supabase.from("product_images").delete().match({ id })
    return deleted;
}

const getImages = async (productId) => {
    const images = await supabase.from("product_images").select("*").match(productId)
    return images;
}

const SaveProduct = async (product) => {
    const { id, name, price, description, categoryId, typeId } = product
    // save changes to product
    const p_edit = await supabase.from("products").update({
        name, price, description, categoryId, typeId
    }).match({ id })

    // if successfully updated product
    if (p_edit.data) {
        // save changes to product images
        const { oldImages, newImages, originalImages } = product
        // delete images that are remove by user
        for (let img of originalImages) {
            // find image in old images
            let foundImages = oldImages.filter((img_o) => {
                return img_o.id === img.id
            })
            // if not found or deleted
            if (foundImages.length <= 0) {
                // delete img
                await DeleteImage(img.id)
            }
        }

        // add new images
        for (let img of newImages) {
            console.log("adding new img: ", img)
            const uploaded = await supabase
                .storage
                .from('products')
                .upload(img.name, img)

            const { publicURL, error } = supabase
                .storage
                .from('products')
                .getPublicUrl(img.name)
            await AddImage(product.id, publicURL)

        }
    }
}

const DeleteProduct = async (id) => {
    const deletedImages = await supabase.from("product_images").delete().match({ productId: id })
    const { data, error } = await supabase.from("products").delete().match({ id })

    return { data, error };
}

export {
    AddProduct,
    DeleteProduct,
    SaveProduct
}