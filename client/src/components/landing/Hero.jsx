import React from "react";
import Container from "../core/Container";
import Button from "../core/Button";

const Hero = () => {
  return (
    <section className="relative bg-black py-28 overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [bg-size:20px_20px] opacity-20"></div>

      <Container>
        <div className="relative text-center space-y-8">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            Build Discipline.
            <br />
            <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Earn XP. Dominate Life.
            </span>
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            HabitIQ helps you track habits, build streaks, unlock achievements,
            compete on leaderboards, and get AI-powered productivity coaching.
          </p>

          <div className="flex justify-center gap-4">
            <Button target="/register">Start Free</Button>
            <Button target="/login">Login</Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 pt-10 text-sm text-zinc-400">
            <div>
              <p className="text-white font-semibold text-lg">10K+</p>
              Users
            </div>
            <div>
              <p className="text-white font-semibold text-lg">1M+</p>
              Habits Tracked
            </div>
            <div>
              <p className="text-white font-semibold text-lg">250K+</p>
              Streaks Built
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Hero;