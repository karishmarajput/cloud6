import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from "./pages/LandingPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "./pages/Layout";
import OgLogin from "./pages/organisation/OgLogin";
import OgRegister from "./pages/organisation/OgRegister";

function App() {
  return (
    <div className="App">
         <BrowserRouter>
            <Routes>
              <Route >
                <Route index element={<LandingPage />} />
                <Route path ="ogLogin" element={<OgLogin/>}/>
                <Route path ="OgRegister" element={<OgRegister/>}/>
                {/* <Route path="blogs" element={<Blogs />} />
                <Route path="contact" element={<Contact />} /> */}
                {/* <Route path="*" element={<NoPage />} /> */}
              </Route>
            </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
