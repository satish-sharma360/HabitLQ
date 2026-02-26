import React from "react";
import { Link } from "react-router-dom";
import Container from "../core/Container";
import Button from "../core/Button";
import Logo from "../core/Logo";

const Navbar = () => {
  return (
    <nav className="border-b border-zinc-800 bg-black/80 backdrop-blur sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">

          <Link to="/">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-zinc-400 hover:text-white text-sm">
              Features
            </a>
            <a href="#analytics" className="text-zinc-400 hover:text-white text-sm">
              Analytics
            </a>
            <Button target="/login">Login</Button>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;