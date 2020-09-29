import React from 'react';

const Header = () => {
    return (
        <header className="navbar">
            <a href="/">mhz blog</a>
            <div>
                <a href="/about">about</a>
                <a href="/archive">archive</a>
                <a href="/tags">tags</a>
            </div>
        </header>
    )
};

export default Header;