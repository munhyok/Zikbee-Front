import logo from './logo.svg';
import './App.css';
import {Main} from './component/main/layout/main'
import {Goods} from './component/goods/layout/goods'
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"


Modal.setAppElement('#root')
function App() {
  
  return (
    
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='goods/:item' element={<Goods />} />
          </Routes>
        </Router>
      </div>
    
  );
}


export default App;
