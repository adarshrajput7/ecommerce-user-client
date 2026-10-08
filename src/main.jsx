// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // ⭐ IMPORTANT: Add CSS
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AuthCheck from "./AuthCheck.jsx";
import LenisProvider from './components/LenisProvider'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store} >
    <BrowserRouter>
      <AuthCheck />
      <LenisProvider>
        <App />
      </LenisProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 3000,
          className: `
      !bg-[#0b0f10]/90
      !text-white
      !border
      !border-white/[0.10]
      !rounded-2xl
      !px-4
      !py-3
      !shadow-[0_10px_40px_rgba(0,0,0,0.45)]
      !backdrop-blur-2xl
      !backdrop-saturate-150
      !font-medium
      !text-sm
    `,
          success: {
            className: `
        !bg-[#0b0f10]/90
        !text-white
        !border
        !border-[#00FFFF]/20
        !shadow-[0_10px_40px_rgba(0,0,0,0.45)]
        !backdrop-blur-2xl
      `,
            iconTheme: {
              primary: "#00FFFF",
              secondary: "#0b0f10",
            },
          },
          error: {
            className: `
        !bg-[#0b0f10]/90
        !text-white
        !border
        !border-red-400/20
        !shadow-[0_10px_40px_rgba(0,0,0,0.45)]
        !backdrop-blur-2xl
      `,
            iconTheme: {
              primary: "#ff4d6d",
              secondary: "#0b0f10",
            },
          },
        }}
      />


    </BrowserRouter>
  </Provider>
)
