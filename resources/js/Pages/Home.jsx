import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Reveal from "@/Components/Reveal";
import Hero from "@/Components/sections/Hero";
import About from "@/Components/sections/About";
import Timeline from "@/Components/sections/Timeline";
import Metrics from "@/Components/sections/Metrics";
import Certs from "@/Components/sections/Certs";
import CTA from "@/Components/sections/CTA";
import Awards from "@/Components/sections/Awards";
import Services from "@/Components/sections/Services";
import FileCase from "@/Components/sections/FileCase";
import Contact from "@/Components/sections/Contact";
import Footer from "@/Components/sections/Footer";

/**
 * Landing page
 * Props are injected via Inertia from LandingController
 */
export default function Home({
  stats,
  metrics,
  certs,
  timeline,
  awards,
  services,
  // process,   // uncomment if using ProcessOverview
  offices,
}) {
  return (
    <MainLayout title="Liberal Lawyers – Leading UAE Legal Services">

      {/* Page sections with reveal-on-scroll effect */}
      <Reveal>
        <Hero />
      </Reveal>

      <Reveal>
        <About stats={stats} />
      </Reveal>

      <Reveal>
        <Timeline items={timeline} />
      </Reveal>

      <Reveal>
        <Metrics items={metrics} />
      </Reveal>

      {/* <Reveal>
        <Certs items={certs} />
      </Reveal> */}

      <Reveal>
        <CTA />
      </Reveal>
{/*
      <Reveal>
        <Awards items={awards} />
      </Reveal> */}

      <Reveal>
        <Services items={services} />
      </Reveal>

      <Reveal>
        <FileCase />
      </Reveal>

      <Reveal>
        <Contact offices={offices} />
      </Reveal>

      <Reveal>
        <Footer />
      </Reveal>
    </MainLayout>
  );
}
