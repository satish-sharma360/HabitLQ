import React from "react";
import Container from "../core/Container";
import Button from "../core/Button";

const CTA = () => {
  return (
    <section className="py-20 bg-black">
      <Container>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Ready to start your streak?
          </h2>
          <Button target="/register">
            Join HabitIQ
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default CTA;