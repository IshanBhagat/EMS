import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <h1>Election Management System</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>
        </header>
    );
}

export default Header;