import { useEffect, useState } from 'react'
import { Nav } from '../components/nav'

const taglines = [
    'Fast, accurate slit calculations.',
    'Visualize your labels before you print.',
    'Built for the shop floor.',
    'From die layout to finished roll.'
]

export function Home() {
    const [displayText, setDisplayText] = useState('')

    useEffect(() => {
        let ti = 0
        let ci = 0
        let deleting = false
        let timeoutId

        function typeLoop() {
            const current = taglines[ti]

            if (!deleting) {
                ci++
                setDisplayText(current.slice(0, ci))
                if (ci === current.length) {
                    deleting = true
                    timeoutId = setTimeout(typeLoop, 1600)
                    return
                }
            } else {
                ci--
                setDisplayText(current.slice(0, ci))
                if (ci === 0) {
                    deleting = false
                    ti = (ti + 1) % taglines.length
                }
            }
            timeoutId = setTimeout(typeLoop, deleting ? 28 : 45)
        }

        timeoutId = setTimeout(typeLoop, 700)

        return () => clearTimeout(timeoutId)
    }, [])

    return (
        <>
            <Nav active="home" />

            <main className="hero-full">
                <div className="float-shape s1"></div>
                <div className="float-shape s2"></div>
                <div className="float-shape s3"></div>
                <div className="float-shape s4"></div>
                <div className="float-shape s5"></div>

                <p className="eyebrow">Merak Labels · Shop Tools</p>
                <h1 className="hero-title">Precision on<br />Every Roll.</h1>
                <p className="hero-tagline">
                    {displayText}<span className="cursor">&nbsp;</span>
                </p>
            </main>

            <footer>Merak Labels Pvt. Ltd. · Internal Use</footer>
        </>
    )
}