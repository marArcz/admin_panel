import React, { useEffect, useState } from 'react'
import FormModal from './FormModal'
import { ToastContainer, toast } from 'react-toastify'
import { showSuccessMessage } from './Notifications'
const AddForm = ({ handleClose, show, data, onSubmit }) => {
    // states
    const [categoryList, setCategoryList] = useState([])
    const [typeList, setTypeList] = useState([])
    const [category, setCategory] = useState(null)
    const [type, setType] = useState(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    // set category and type
    const loadData = () => {
        setCategoryList(data.categories)
        setTypeList(data.types)
        setCategory(categoryList.length > 0 ? categoryList[0] : null)
        setType(typeList.length > 0 ? typeList[0] : null)
    }

    useEffect(() => {
        loadData();
    }, [data])


    const onFileSelect = (e) => {
        let files = e.target.files
        let list = [...images]
        console.log("files: ", files)
        for (let file of files) {
            list.push(file)

        }

        setImages(list)
    }
    const removeImage = (index) => {
        let list = images.filter((img, i) => {
            return i !== index
        })

        setImages(list)
    }

    const resetForm = () =>{
        setName("");
        setPrice("")
        setDescription("")
        setImages([])
    }
    const onFormSubmit = async (e) => {
        e.preventDefault();
        console.log("categoryID: ", category)
        await onSubmit({name,price,description,category,type,images})
        showSuccessMessage("Successfully added!")
        resetForm();
    }
    return (
        <div>
            {/* toast notification */}
            <ToastContainer />
            {/* form */}
            <FormModal title="Add New Product" size="lg" handleClose={handleClose} show={show}>
                <form action="#" method="post" onSubmit={onFormSubmit}>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Product Images</label>
                        <input type="file" accept='image/*' multiple className='form-control d-none' id='file-select' onChange={onFileSelect} />
                        <div className="d-grid">
                            <label htmlFor="file-select" className='btn btn-secondary'>Add Image</label>
                        </div>
                        <div className="card bg-light mt-3">
                            <div className="card-body">
                                <p className='text-black-50'><small>Images</small></p>
                                <div className=" row">
                                    {images && images.map((img, index) => (
                                        <div key={index} className='col-md-3' draggable={true}>
                                            <div className="card bg-light product-img" draggable={true}>
                                                <div className="card-body position-relative pt-4">
                                                    <div className="text-end mb-2">
                                                        <button type="button" onClick={() => removeImage(index)} className='close btn btn-dark btn-sm p-1 py-0 rounded-0 position-absolute end-0 top-0'><i className='m-0 bx bx-x'></i></button>
                                                    </div>
                                                    <img src={URL.createObjectURL(img)} draggable={true} className="card-img-top" alt="..." />
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
                            {categoryList && categoryList.map((c, index) => (
                                <option key={index} value={index}>{c.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Type</label>
                        <select name="" className='form-select' onChange={e => setType(typeList[e.target.value])}>
                            {typeList && typeList.map((c, index) => (
                                <option key={index} value={index}>{c.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Description</label>
                        <textarea name="" className='form-control' required cols="30" rows="10" onChange={e => setDescription(e.target.value)} value={description}></textarea>
                    </div>
                    <div className="d-grid">
                        <button className='btn btn-dark' type='submit'>Add Product</button>
                    </div>
                </form>
            </FormModal>
        </div >
    )
}

export default AddForm