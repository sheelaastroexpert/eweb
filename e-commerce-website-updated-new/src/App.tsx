import AuthModal from "./modules/auth/components/AuthModal";
import Login from "./modules/auth/components/Login"
import ProductList from "./modules/products/components/ProductList";
import AppRoutes from "./shared/routes/AppRoutes";

const App = ()=>{
  // return (<Login/>)
  // return (<ProductList/>)
  return (
  <>
  <AuthModal />
  <AppRoutes/>
  </>)
}
export default App;