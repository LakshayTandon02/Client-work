import { departments } from "@/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Baby, Activity, Stethoscope, User, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const iconMap: Record<string, any> = {
  Heart,
  Brain,
  Baby,
  Activity,
  Stethoscope,
  User,
};

export default function Departments() {
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
            Our Departments
          </motion.h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            Comprehensive medical services delivered by specialized teams using advanced technology.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => {
              const Icon = iconMap[dept.icon] || Activity;
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-none">
                    <CardHeader className="pb-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-2xl">{dept.name}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {dept.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {dept.longDescription}
                      </p>
                      <div className="pt-4 flex items-center justify-between">
                        <Link
                          to={`/doctors?dept=${dept.id}`}
                          className="text-primary font-semibold flex items-center hover:underline text-sm"
                        >
                          Meet the Doctors <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link
                          to="/appointment"
                          className="text-slate-500 hover:text-primary transition-colors text-sm font-medium"
                        >
                          Book Appointment
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-12 text-primary-foreground relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">Need specialized care?</h2>
              <p className="text-lg opacity-90 mb-8">
                Our departments are equipped with the latest medical technology and staffed by experts who are leaders in their fields. We provide personalized treatment plans tailored to your specific needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/appointment"
                  className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
                >
                  Schedule a Consultation
                </Link>
                <Link
                  to="/contact"
                  className="border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 hidden lg:block">
              <Stethoscope className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
