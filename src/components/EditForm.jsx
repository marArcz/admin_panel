import React, { useEffect, useState } from 'react'
import FormModal from './FormModal'
import { ToastContainer, toast } from 'react-toastify'
import { showSuccessMessage } from './Notifications'
const EditForm = ({ handleClose, show, data, onSubmit, product }) => {
    // states
    const [categoryList, setCategoryList] = useState([])
    const [typeList, setTypeList] = useState([])
    const [category, setCategory] = useState(null)
    const [type, setType] = useState(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [newImages, setNewImages] = useState([])
    const [originalImages, setOriginalImages] = useState([])
    const [id, setId] = useState(null)
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    // set category and type
    const loadData = () => {
        setCategoryList(data.categories)
        setTypeList(data.types)
        setCategory(categoryList.length > 0 ? categoryList[0] : null)
        setType(typeList.length > 0 ? typeList[0] : null)

        // load product
        let images = product.product_images

        setName(product.name)
        setPrice(product.price)
        setDescription(product.description)
        setCategory(product.category)
        setType(product.type)
        setImages(images)
        setOriginalImages(images)
        setOldImages(images)
        setId(product.id)
        setNewImages([])
    }

    useEffect(() => {
        if(!isDataLoaded){
        loadData();

        }

    },[data])


    const onFileSelect = (e) => {
        let files = e.target.files
        let list = [...images]
        let newImgs = [...newImages]
        console.log("files: ", files)
        for (let file of files) {
            list.push(file)
            newImgs.push(file)

        }
        setNewImages(newImgs)
        setImages(list)
        e.target.value = ""
    }
    const removeImage = (index) => {
        let img = images[index]
        // if new image
        if (!img.src) {
            console.log('remove new photo')
            let new_images = newImages.filter((x) => {
                return img.id !== x.id;
            })
            setNewImages(new_images)
        }
        // if old
        else {
            console.log("old photo: ", img)
            let old = oldImages.filter((x) => {
                return img.id !== x.id;
            })
            setOldImages(old)
        }


        let list = images.filter((img, i) => {
            return i !== index
        })

        console.log('old imhgs: ', oldImages)
        console.log('new imagess: ', newImages)
        setImages(list)
    }

    const resetForm = () => {
        setName("");
        setPrice("")
        setDescription("")
        resetImages()
        setNewImages([])
    }
    const onFormSubmit = async (e) => {
        e.preventDefault();
        console.log("olds: ", oldImages)
        console.log("new in submit: ", newImages)
        console.log("categoryID: ", category)
        await onSubmit({ id, name, price, description, categoryId: category.id, typeId: type.id, oldImages, newImages, originalImages })
        showSuccessMessage("Successfully saved changes!")
        handleClose()
    }
    const resetImages = () =>{
        setImages(originalImages)
        setOldImages(originalImages)
        setNewImages([])
    }
    return (
        <div>
            {/* toast notification */}
            <ToastContainer />
            {/* form */}
            <FormModal title="Edit Product" size="lg" handleClose={handleClose} show={show}>
                <form action="#" method="post" onSubmit={onFormSubmit}>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Product Images</label>
                        <input type="file" accept='.jpg,.png.webp' multiple className='form-control d-none' id='file-select' onChange={onFileSelect} />
                        <div className="d-grid">
                            <label htmlFor="file-select" className='btn btn-secondary'>Add Image</label>
                        </div>
                        <div className="card bg-light mt-3">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <p className='text-black-50'><small>Images</small></p>
                                    <button type='button' onClick={resetImages} className='ms-auto btn-link btn text-decoration-none text-black-50'><small><i className='bx bx-refresh'></i> Reset</small></button>
                                </div>
                                <div className=" row">
                                    {images && images.map((img, index) => (
                                        <div key={index} className='col-md-3' draggable={true}>
                                            <div className="card bg-light product-img" draggable={true}>
                                                <div className="card-body position-relative pt-4">
                                                    <div className="text-end mb-2">
                                                        <button type="button" onClick={() => removeImage(index)} className='close btn btn-dark btn-sm p-1 py-0 rounded-0 position-absolute end-0 top-0'><i className='m-0 bx bx-x'></i></button>
                                                    </div>
                                                    {/* <p>Type: {typeof(img)}</p> */}
                                                    <img src={img.src ? img.src : URL.createObjectURL(img)} draggable={true} className="card-img-top" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Product Name</label>
                        <input type="text" required className='form-control' value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Price</label>
                        <input type="number" required className='form-control' value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Category</label>
                        <select name="" className='form-select' onChange={e => setCategory(categoryList[e.target.value])}>
                            <option value={category ? categoryList.indexOf(category) : ""}>{category ? category.description : ""}</option>
                            {categoryList && categoryList.map((c, index) => {
                                return c.id !== category.id ? (<option key={index} value={index}>{c.description}</option>) : null
                            })}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Type</label>
                        <select name="" className='form-select' onChange={e => setType(typeList[e.target.value])}>
                            <option value={type ? typeList.indexOf(type) : ""}>{type ? type.description : ""}</option>
                            {typeList && typeList.map((t, index) => {
                                return t.id !== type.id ? (<option key={index} value={index}>{t.description}</option>) : null
                            })}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Description</label>
                        <textarea name="" className='form-control' required cols="30" rows="10" onChange={e => setDescription(e.target.value)} value={description}></textarea>
                    </div>
                    <div className="d-grid">
                        <button className='btn btn-dark' type='submit'>Save Product</button>
                    </div>
                </form>
            </FormModal>
        </div >
    )
}

export default EditForm