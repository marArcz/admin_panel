import {toast} from 'react-toastify'

export const showSuccessMessage = (msg) => {
    toast.success(msg, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
    });
}
export const showErrorMessage = (msg) => {
    toast.error(msg, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
    });
}