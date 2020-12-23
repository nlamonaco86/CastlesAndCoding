import './App.css';
import Menu from './components/Menu';
import menus from './menus'
import Creator from './components/Creator'
import creators from './creators'
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <Router>

        {menus.map(i => {
          return <Route exact={true} path={i.path}>
            <Menu img={i.img} title={i.title} options={i.options} />
          </Route>
        })}

        {creators.map(i => {
          return <Route exact={true} path={i.path}>
             <Creator title={i.title} img={i.img} type={i.type} />
          </Route>
        })}

      </Router>
    </div>
  );
}

export default App;
