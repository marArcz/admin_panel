import React, { useEffect, useState } from 'react'
import { supabase } from './connection'
import {useNavigate} from 'react-router-dom'
const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();
    

    const onSubmit = async (e) => {
        e.preventDefault();

        const { user, session, error } = await supabase.auth.signIn({
            email,
            password
        })
        if (user) {
            navigate("/");
        }
    }

    return (
        <div className='container'>
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <div className="card mt-5">
                        <div className="card-body">
                            <h4>Admin Login</h4>
                            <hr />
                            <form action="#" onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address:</label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className='form-control' id='email' />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className='form-control' id='password' />
                                </div>
                                <div className="d-grid">
                                    <button className='btn btn-secondary' type='submit'>LOG IN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login