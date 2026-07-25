import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const links = [
    { id: 'home', href: '/', label: 'Home' },
    { id: 'slit', href: '/slit-calculator', label: 'Slit Calculator' },
    { id: 'visualizer', href: '/label-visualizer', label: 'Label Visualizer' },
]

export function Nav({ active }) {
    async function handleLogout() {
        await supabase.auth.signOut()
        // AuthProvider's listener picks up the cleared session automatically
    }

    return (
        <nav>
            <Link to="/" className="brand">
                <span className="dot"></span>Merak Labels — Shop Tools
            </Link>

            <div className="navlinks">
                {links.map((link) => (
                    <Link
                        key={link.id}
                        to={link.href}
                        className={link.id === active ? 'active' : undefined}
                    >
                        {link.label}
                    </Link>
                ))}

                <details className="more">
                    <summary>More <span className="caret">▾</span></summary>
                    <div className="dropdown">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout() }}>
                            Logout
                        </a>
                    </div>
                </details>
            </div>

            <details className="hamburger">
                <summary aria-label="Open menu"><span></span><span></span><span></span></summary>
                <div className="dropdown">
                    {links.map((link) => (
                        <Link
                            key={link.id}
                            to={link.href}
                            className={link.id === active ? 'active' : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a href="#" onClick={(e) => { e.preventDefault(); handleLogout() }}>
                        Logout
                    </a>
                </div>
            </details>
        </nav>
    )
}