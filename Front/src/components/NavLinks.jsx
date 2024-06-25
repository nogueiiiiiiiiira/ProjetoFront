import React from "react";
import style from '../components/NavLinks.module.css'

const NavLinks = () => {
    return(
        <nav>
            <div className={style.navLinks} id="navLinks">
                <ul>
                    <li><a href="/">HOME</a></li>
                    <li><a href="/sobrenos">SOBRE NÓS</a></li>
                    <li><a href="/contatos">CONTATOS</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default NavLinks;