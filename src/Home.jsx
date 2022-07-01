import { supabase } from './connection';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AddForm from './components/AddForm';
import { AddProduct, DeleteProduct, SaveProduct } from './Backend'
import { toast, ToastContainer } from 'react-toastify';
import { showSuccessMessage, showErrorMessage } from './components/Notifications';
import PreloaderModal from './components/PreloaderModal';
import EditForm from './components/EditForm';
import { useNavigate } from 'react-router-dom';
function Home() {

    const [user, setUser] = useState(null)
    const [isUserLoaded, setIsUserLoaded] = useState(false)
    const [isProductsLoaded, setIsProductsLoaded] = useState(false)
    const [products, setProducts] = useState([])
    const [isAddFormOpen, setIsAddFormOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [categories, setCategories] = useState([])
    const [types, setTypes] = useState([])
    const [isCategoryTypeLoaded, setIsCategoryTypeLoaded] = useState(false)
    const [showPreloader, setShowPreloader] = useState(false)
    const [productToEdit, setProductToEdit] = useState(null)
    const [checkedProducts, setCheckedProducts] = useState([])
    const [showDelete, setShowDelete] = useState(false)

    const navigate = useNavigate()
    // load products function
    const loadProducts = async () => {
        const { data, error } = await supabase.from("products").select("*,category(*),product_images:product_images_productId_fkey(*),type(*)").order("id", { ascending: false })
        console.log("products: ", data)
        if (data) {
            setProducts(data);
            setIsProductsLoaded(true);

            setCheckedProducts(new Array(data.length).fill(false))
            console.log('checks: ', checkedProducts)

        }
    }
    // load user
    const loadUser = async () => {
        const user = supabase.auth.user()
        if (user) {
            setUser(user);
            setIsUserLoaded(true)
            console.log(user)
        }else{
            navigate("/login")
        }
    }
    const getCategoriesAndTypes = async () => {
        const categories = await supabase.from("category").select("*")
        const type = await supabase.from("type").select("*")

        setCategories(categories.data)
        setTypes(type.data)

        setIsCategoryTypeLoaded(true)
    }

    useEffect(() => {
        if (!isProductsLoaded) {
            loadProducts();
        }
        if (!isUserLoaded) {
            loadUser();
        }
    })

    useEffect(() => {
        if (!isCategoryTypeLoaded) {
            getCategoriesAndTypes()

        }
    }, [categories, types])

    const HandleDelete = async (id) => {
        console.log("deleted product")


        let result = await DeleteProduct(id);

        if (!result.error) {
            showSuccessMessage("Successfully deleted!")
            let updatedProducts = products.filter((p, i) => {
                return p.id !== id
            })
            setProducts(updatedProducts)
        } else {
            showErrorMessage("Failed to delete product, " + result.error.message)
        }
    }

    const HandleAdd = async (product) => {
        setShowPreloader(true)
        await AddProduct(product)
        await loadProducts();

        setShowPreloader(false)

    }
    const HandleEdit = async (product) => {
        setShowPreloader(true)
        await SaveProduct(product)
        await loadProducts();

        setShowPreloader(false)

    }
    const getTextColor = i => {
        let colors = ['', 'danger', 'warning', 'info'];
        return colors[i]
    }

    const editBtnClicked = (product) => {
        setProductToEdit(product);
        setIsEditFormOpen(true)
    }

    const handleCheck = async (index) => {
        const updated = checkedProducts.map((item, i) => {
            return index === i ? !item : item
        })
        setCheckedProducts(updated)
        setShowDelete(hasChecked(updated))

    }

    const hasChecked = (arr) => {
        for (let checked of arr) {
            console.log("checked: ", checked)
            if (checked) {
                return true;
            }
        }
        return false;
    }

    const deleteChecked = async () => {
        setShowPreloader(true)
        let i = 0;
        const toDelete = []
        for (let checked of checkedProducts) {
            if (checked) {
                toDelete.push(products[i]);
                await DeleteProduct(products[i].id)
            }
            i++;
        }

        let updatedProducts = products.filter((p) => {
            return !toDelete.includes(p);
        })
        let checks =  checkedProducts.map(item =>{
            return false;
        })
        setCheckedProducts(checks)
        setShowDelete(false)

        setProducts(updatedProducts)
        setShowPreloader(false)
        showSuccessMessage("Successfully deleted!")
    }

    return (
        <div className="Home">
            {/* toast notification */}
            <ToastContainer />
            {/* navbar */}
            <Navbar />
            <div className="container-fluid mt-3">
                <h3 className='mb-4 text-secondary'>Products</h3>
                <div className="d-flex mb-3">
                    {showDelete && (<button type='button' onClick={deleteChecked} className="btn btn-sm btn-danger ">Delete Selected</button>)}
                    <button onClick={() => setIsAddFormOpen(true)} className='ms-auto btn btn-sm btn-light'><i className='bx bx-plus'></i> Add New</button>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className='bg-dark text-light'>
                            <tr>
                                <td></td>
                                <td>#</td>
                                <td>Product</td>
                                <td>Description</td>
                                <td>Price</td>
                                <td>Category</td>
                                <td>Type</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {/* map and load products */}
                            {products ? (
                                products.map((product, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="form-check form-check-sm">
                                                <input checked={checkedProducts[index]} onChange={() => handleCheck(index)} className="form-check-input form-check-input-sm" type="checkbox" value="" />
                                            </div>
                                        </td>
                                        <td><small className='text-light fw-'>{index + 1}</small></td>
                                        <td><img src={product.product_images.length > 0 ? product.product_images[0].src : ""} width={50} alt="" className='img-thumbnail img-fluid me-3' /><small className='text-light fw-'>{product.name}</small></td>
                                        <td><small className='text-light fw- text-wrap'>{product.description}</small></td>
                                        <td><small className='text-light fw-'>P {product.price}</small></td>
                                        <td><small className={`text-${getTextColor(product.category.id)} fw-`}>{product.category.description}</small></td>
                                        <td><small className='text-light fw-'>{product.type.description}</small></td>
                                        <td>
                                            <button className='btn btn-sm btn-success m-2' type='button' onClick={() => editBtnClicked(products[index])}><i className='bx bx-edit'></i></button>
                                            <button className='btn btn-sm btn-danger m-2' onClick={() => HandleDelete(product.id)} type='button'><i className='bx bx-trash'></i></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='text-center'>
                                        <div className="spinner-border text-danger" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add form modal */}
            <AddForm show={isAddFormOpen} handleClose={() => setIsAddFormOpen(false)} onSubmit={HandleAdd} data={{ categories, types }} />

            {/* edit form */}
            {productToEdit && (<EditForm show={isEditFormOpen} handleClose={() => setIsEditFormOpen(false)} onSubmit={HandleEdit} data={{ categories, types }} product={productToEdit} />)}

            {/* preloader */}
            <PreloaderModal show={showPreloader} onClose={() => setShowPreloader(false)} />
        </div>
    );
}

export default Home;
