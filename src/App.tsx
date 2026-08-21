
import { AuthProvider } from './contexts/authContext'
import Router from './routes'

const App = () => {
  return (
    <AuthProvider>
      <Router/>
    </AuthProvider>
  )
}

export default App