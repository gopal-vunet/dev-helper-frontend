import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HomePage } from './screens/home/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AddStatus } from './screens/add_status/addStatus';
import { Login } from './screens/auth/login';
import { AuthProvider } from './context/authContext';
import { RequireAuth } from './context/protectedRoute';
import { Header } from './components/header';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <AuthProvider>
      <Header />
      <Routes>
        <Route path='/' element={<RequireAuth children={<HomePage />} />} />
        <Route path='/add' element={<RequireAuth children={<AddStatus />} />} />
        <Route path='/add/:devId' element={<RequireAuth children={<AddStatus />} />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </AuthProvider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
