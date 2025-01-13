import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./assets/styles/App.css";
import Cliente from "./pages/Cliente"
import Restaurante from "./pages/Restaurante";
import Bienvenida from "./pages/Bienvenida"
import CrudProducto from "./pages/Productos";
import CrudOferta from "./pages/crudOferta";
import AddProduct from "./pages/AddProduct";
import Register from "./pages/Register";
import RegistroCliente from "./pages/registroCliente";
import CheckoutPage from "./pages/CheckoutPage";
import RegistroCategoria from "./pages/crudCategoria";
import AddCategoria from "./pages/AddCategoria";
import EditProduct from "./pages/EditProduct";
import EditCategoria from "./pages/EditCategoria";
import AddOferta from "./pages/AddOferta";
import EditOferta from "./pages/EditOferta";
import MiPerfil from "./pages/MiPerfil";
import ReservacionesRecibidas from "./pages/ReservacionesRecibidas";
import EditComentarios from "./pages/EditComentarios";
import AddComentario from "./pages/AddComentario";
import { CommentsProvider } from './pages/commentsContext'; 
import HistorialReserva from "./pages/HistorialReservas";
import ReservacionesEnProceso from "./pages/ReservacionesEnProceso";
import ReservacionesListas from "./pages/ReservacionesListas";
import ReservacionesHistorial from "./pages/ReservacionesHistorial";
import MenuPage from "./pages/MenuPage";
import AddTipoOferta from "./pages/AddOfertasTipoPage"
function App() {
  return (
    <div className="App">
      <CommentsProvider>
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Inicio" element={<Cliente />} /> 
          <Route path="/Registro" element={<Register />} />
          <Route path="/Registro-Cliente" element={<RegistroCliente />} />
          <Route path="/Restaurante" element={<Restaurante />} /> 
          <Route path="/" element={<Bienvenida />} />
          <Route path="/checkout" element={<CheckoutPage />}/>
          <Route path="/RegistroOfertas" element={<CrudOferta />} /> 
          <Route path="/RegistroOfertas/AgregarOferta" element={<AddOferta />} /> 
          <Route path="/RegistroOfertas/EditarOferta" element={<EditOferta />} />
          <Route path="/RegistroProductos" element={<CrudProducto />} />
          <Route path="/RegistroProductos/AgregarProducto" element={<AddProduct />} /> 
          <Route path="/RegistroCategoria" element={<RegistroCategoria />} /> 
          <Route path="/RegistroCategoria/AgregarCategoria" element={<AddCategoria />} /> 
          <Route path="/RegistroProductos/EditarProducto" element={<EditProduct />} /> 
          <Route path="/RegistroCategoria/EditarCategoria" element={<EditCategoria />} /> 
          <Route path="/MiPerfil" element={<MiPerfil />} />
          <Route path="/Menu" element={<MenuPage/>}/>
          <Route path="/AgregarTipoOferta" element={<AddTipoOferta/>}/>

          <Route path="/ReservasRecibidas" element={<ReservacionesRecibidas />} />
          <Route path="/ReservasEnProceso" element={<ReservacionesEnProceso />} /> 
          <Route path="/ReservasListas" element={<ReservacionesListas />} /> 
          <Route path="/ReservasHistorial" element={<ReservacionesHistorial />} /> 
          <Route path="/HistorialReservas" element={<HistorialReserva />} /> 

        </Routes>
      </Router>
      </CommentsProvider>
    </div>
  );
}

export default App;


