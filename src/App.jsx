import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@popperjs/core/dist/cjs/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Produto from './components/produtos/produtos';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Menu from './components/menu/menu';
import Home from './components/home';

const rotas = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/produtos",
        element: <Produto />,
      }
    ]
  }
])

function App () {
  return(
    <RouterProvider router={rotas} />
  );
}

export default App;