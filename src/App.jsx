import './App.css'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { RouterProvider } from 'react-router'
import { router } from './router/router'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
    })
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
