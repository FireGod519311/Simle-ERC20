import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import TokenManager from './pages/TokenManager';
import MainLayout from './layouts/mainlayout';
import Swap from './pages/Swap';
import Liquidity from './pages/Liquidity';

function App() {
  return (
    <div className="App min-h-screen bg-[#363b48]">
            <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainLayout />} >
              <Route index element={<Swap />} />
              <Route path="token" element={<TokenManager />} />
              <Route path="liquidity" element={<Liquidity />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
