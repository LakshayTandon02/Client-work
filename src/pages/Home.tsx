import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { departments, doctors } from "@/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Baby, Activity, ArrowRight, ShieldCheck, Clock, UserCheck } from "lucide-react";
import { motion } from "motion/react";

const iconMap: Record<string, any> = {
  Heart,
  Brain,
  Baby,
  Activity,
};

import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/hospital-hero/1920/1080"
            alt="Hospital Hero"
            className="h-full w-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Your Health is Our <span className="text-primary">Priority</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              At Kalyani Hospital, we combine cutting-edge medical technology with compassionate care to provide the best healthcare experience for you and your family.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" render={<Link to="/appointment" />} className="px-8">
                Book an Appointment
              </Button>
              <Button size="lg" variant="outline" render={<Link to="/departments" />} className="px-8">
                Explore Departments
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "24/7 Emergency",
                description: "Round-the-clock emergency services with specialized trauma care.",
                icon: Clock,
              },
              {
                title: "Expert Doctors",
                description: "Highly qualified and experienced medical professionals in every field.",
                icon: UserCheck,
              },
              {
                title: "Advanced Tech",
                description: "State-of-the-art diagnostic and surgical equipment for precise care.",
                icon: ShieldCheck,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Our Departments</h2>
              <p className="mt-2 text-slate-600">Specialized care across multiple medical disciplines.</p>
            </div>
            <Link to="/departments" className="text-primary font-medium flex items-center hover:underline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.slice(0, 4).map((dept, index) => {
              const Icon = iconMap[dept.icon] || Activity;
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-none">
                    <CardHeader>
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{dept.name}</CardTitle>
                      <CardDescription>{dept.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/departments" className="text-sm font-medium text-primary hover:underline">
                        Learn More
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Doctors Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Meet Our Specialists</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Our team of world-class doctors is dedicated to providing you with the highest standard of medical care.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <Button variant="secondary" size="sm" render={<Link to="/doctors" />}>
                      View Profile
                    </Button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                <p className="text-primary font-medium">{doctor.specialty}</p>
                <p className="text-sm text-slate-500 mt-1">{doctor.education}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" render={<Link to="/doctors" />}>
              View All Doctors
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to prioritize your health?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Book an appointment today and experience the excellence of Kalyani Hospital.
          </p>
          <Button size="lg" variant="secondary" render={<Link to="/appointment" />} className="px-10 py-6 text-lg">
            Book Appointment Now
          </Button>
        </div>
      </section>
    </div>
  );
}
