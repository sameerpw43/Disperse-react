
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";


import Disperse from "./disperse";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Disperse/>}/>
        
        
        
      
      </Routes>
     
    </Router>
  );
}

export default App;
