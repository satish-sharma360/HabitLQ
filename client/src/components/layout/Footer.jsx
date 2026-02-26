import React from "react";
import Container from "../core/Container";
import Logo from "../core/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-black py-16">
      <Container>

        <div className="grid md:grid-cols-3 gap-10 text-sm text-zinc-400">

          <div>
            <Logo />
            <p className="mt-4 max-w-xs">
              Build better habits, earn XP and level up your life with HabitIQ.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Product</h4>
            <ul className="space-y-2">
              <li>Features</li>
              <li>Leaderboard</li>
              <li>Analytics</li>
              <li>AI Coach</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Company</h4>
            <ul className="space-y-2">
              <li>About</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-zinc-800 mt-12 pt-6 text-center text-zinc-500 text-xs">
          © {new Date().getFullYear()} HabitIQ. All rights reserved.
        </div>

      </Container>
    </footer>
  );
};

export default Footer;