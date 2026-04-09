import { hospitalDetails } from "@/data";
import { Shield, Award, Users, Target } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            About Kalyani Hospital
          </motion.h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            A legacy of care, a future of health. Serving our community with excellence since 1995.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://picsum.photos/seed/hospital-about/800/600"
                alt="Hospital Building"
                className="rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                  <Target className="mr-3 h-8 w-8 text-primary" /> Our Mission
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed text-lg">
                  To provide exceptional healthcare services that are accessible, affordable, and patient-centered. We strive to be the healthcare provider of choice by delivering clinical excellence and compassionate service.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                  <Shield className="mr-3 h-8 w-8 text-primary" /> Our Vision
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed text-lg">
                  To be a global leader in healthcare innovation, setting benchmarks in medical excellence, patient safety, and holistic healing.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
            <p className="mt-4 text-slate-600">The principles that guide every action we take.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Compassion",
                description: "We treat every patient with kindness, empathy, and respect.",
                icon: Heart,
              },
              {
                title: "Excellence",
                description: "We are committed to the highest standards of clinical quality.",
                icon: Award,
              },
              {
                title: "Integrity",
                description: "We act with honesty, transparency, and ethical conduct.",
                icon: Shield,
              },
              {
                title: "Collaboration",
                description: "We work together as a team to achieve the best outcomes.",
                icon: Users,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: "Years of Excellence", value: "25+" },
              { label: "Expert Doctors", value: "50+" },
              { label: "Happy Patients", value: "100k+" },
              { label: "Beds Capacity", value: "500+" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-extrabold text-primary mb-2">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { Heart } from "lucide-react";
