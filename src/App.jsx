import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { MoonLoader } from 'react-spinners'
import { useAuth } from './AuthProvider'
import { LoginPage } from './LoginPage'
import { Home } from './pages/Home'
import { SlitCalculator } from './pages/SlitCalculator'
import { LabelVisualizer } from './pages/LabelVisualizer'

function App() {
    const { session, loading } = useAuth()

    return (
        <>
            <Toaster position='bottom-right' richColors />

            {loading && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 'calc(100vh - 70px)',
                    }}
                >
                    <MoonLoader color="#890d18" size={120} />
                </div>
            )}

            {!loading && !session && <LoginPage />}

            {!loading && session && (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/slit-calculator" element={<SlitCalculator />} />
                        <Route path="/label-visualizer" element={<LabelVisualizer />} />
                    </Routes>
                </BrowserRouter>
            )}
        </>
    )
}

export default App