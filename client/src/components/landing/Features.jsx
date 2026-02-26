import React from "react";
import Container from "../core/Container";

const features = [
  {
    title: "Habit Tracking",
    desc: "Track daily habits and maintain streak consistency.",
    icon: "🔥"
  },
  {
    title: "Gamification",
    desc: "Earn XP, unlock badges and compete globally.",
    icon: "🎮"
  },
  {
    title: "AI Coach",
    desc: "Get personalized productivity advice instantly.",
    icon: "🤖"
  },
  {
    title: "Analytics",
    desc: "Weekly, monthly insights & heatmap tracking.",
    icon: "📊"
  },
  {
    title: "Social Community",
    desc: "Share progress and engage with others.",
    icon: "🌍"
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-zinc-950">
      <Container>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-white">
            Powerful Features
          </h2>
          <p className="text-zinc-400 mt-3">
            Everything you need to level up your habits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500 transition"
            >
              <div className="text-2xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-medium mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};

export default Features;