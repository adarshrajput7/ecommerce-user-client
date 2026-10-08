import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./components/Home"
import Profile from "./components/Profile"
import Footwear from "./components/products-pages/Footwear"
import Clothing from "./components/products-pages/Clothing"
import Mobiles from "./components/products-pages/Mobiles"
import ActiveLifestyle from "./components/products-pages/ActiveLifestyle"
import ProductDashboard from "./components/products/ProductDashboard"
import ProductsView from "./components/products/ProductsView"
import Filters from "./components/products-pages/Filters"
import Cart from "./components/cart/Cart"
// import Women from "./components/products/Women"
import { CartProvider } from "./components/cart/CartContext";
import Orders from "./components/cart/Orders"
import Footer from "./components/Footer"
import Search from "./components/Search"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import SearchView from "./components/SearchView"

const App = () => {
const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

//   useEffect(() => {
//   console.log(
//     "%cStop!",
//     "color: red; font-size: 40px; font-weight: bold;"
//   );
//   console.log(
//     "%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a Facebook feature or \"hack\" someone's account, it's a scam and will give them access to your Facebook account.",
//     "font-size: 16px;"
//   );
// }, []);


  const routes = [
    { path: "/", element: <><Navbar transparent  />  <Search /> <Home /><Footer/> </> },
    { path: "/register", element: <><Navbar /> <Search /> <Register /><Footer/></> },
    { path: "/login", element: <><Navbar /> <Search /> <Login /></> },
    { path: "/profile", element: <><Navbar /> <Search /> <Profile /><Footer/></> },
    // { path: "/products", element: <><Navbar /> <Search /> <SideBarr /><Footer/></> },
    // { path: "/pro", element: <><Navbar /> <Products /></> },
    { path: '/view/:id', element: <><Navbar /><Search /> <ProductsView /><Footer/></> },
    { path: '/collections-all-men', element: <><Navbar /><Search /><Filters /></> },
    { path: '/collections-all-women', element: <><Navbar /><Search /><Filters /></> },
    { path: '/collections-footwear', element: <><Navbar /><Search /><Filters /> </> },
    { path: '/collections-clothing', element: <><Navbar /><Search /><Filters /></> },
    { path: '/collections-lifestyle', element: <><Navbar /><Search /><Filters /></> },
    { path: '/collections-mobiles', element: <><Navbar /><Search /><Filters /></> },
    { path: '/collections', element: <><Navbar /><Search /><Filters /></> },
    // { path: '/women', element: <><Navbar /><SideBarr /></> },
    // { path: '/coll', element: <><Navbar /><ProductCatalog /></> },
    // { path: '/coll-women', element: <><Navbar /><Women /></> },
    { path: '/cart', element: <><Navbar /><Search /><Cart /><Footer/> </> },
    { path: '/cart/order', element: <><Navbar /><Search /><Orders /><Footer/></> },
    { path: '/search', element: <><Navbar /><Search/><Filters/><Footer/></> },
    {
      path: "/dash",
      element: (
        <>
          <Navbar />
          <ProductDashboard />
        </>
      ),
      children: [
        { path: "footwear", element: <Footwear /> },
        { path: "clothing", element: <Clothing /> },
        { path: "mobiles", element: <Mobiles /> },
        { path: "activelifestyle", element: <ActiveLifestyle /> },
      ]
    }
  ]

  // 🔁 Recursive function jo children ko bhi render karega
  const renderRoutes = (routes) =>
    routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ))

  return (
    <div className="">
      <CartProvider>
      <Routes>
        {renderRoutes(routes)}
        </Routes>
        </CartProvider>
    </div>
  )
}

export default App


