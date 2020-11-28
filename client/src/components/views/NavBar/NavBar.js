import React from 'react';
import { Link } from 'react-router-dom';

import UserSection from './UserSection';

import '../../../assets/css/navBar.scss';
import { ReactComponent as Logo } from '../../../assets/images/Logo.svg';

function NavBar(props) {
    return (
        <header>
            <div className="logoContainer">
                <Link to="/"><Logo /></Link>
            </div>
            <nav>
                <ul>
                    <li><Link to='/recipe'>레시피</Link></li>
                    <li>커뮤니티</li>
                    <li>장터</li>
                </ul>
            </nav>
            <UserSection />
        </header>
    );
}

export default NavBar;