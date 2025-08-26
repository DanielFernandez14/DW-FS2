import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Dashboard } from '../pages/Dashboard'


const Router = () => {
    return (
    <BrowserRouter> 
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/admin' element={<Dashboard />} />
            <Route path='*' element={<h2>Página no existente...</h2>} />
        </Routes>
    </BrowserRouter>
    )
}

export { Router }