import logo from './logo.svg';
import './App.css';
import Header from './Header' 
import Footer from './Footer'
import Dashboard from './Dashboard'
import Menu from './Menu'

function App() {
  return (
    <div className="wrapper">>
     <Header/>   
     <Menu/>
     <Dashboard/>
     <Footer/>
    </div>
  );
}

export default App;
