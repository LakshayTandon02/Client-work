import { doctors, departments } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Info, Calendar } from "lucide-react";

export default function Doctors() {
  const [searchParams] = useSearchParams();
  const deptFilter = searchParams.get("dept");
  const [selectedDept, setSelectedDept] = useState<string>(deptFilter || "all");

  useEffect(() => {
    if (deptFilter) {
      setSelectedDept(deptFilter);
    }
  }, [deptFilter]);

  const filteredDoctors = selectedDept === "all"
    ? doctors
    : doctors.filter(doc => doc.departmentId === selectedDept);

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
            Our Specialist Doctors
          </motion.h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            Meet our team of highly qualified and experienced medical professionals.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={selectedDept === "all" ? "default" : "outline"}
              onClick={() => setSelectedDept("all")}
              className="rounded-full"
            >
              All Specialists
            </Button>
            {departments.map((dept) => (
              <Button
                key={dept.id}
                variant={selectedDept === dept.id ? "default" : "outline"}
                onClick={() => setSelectedDept(dept.id)}
                className="rounded-full"
              >
                {dept.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white">
                          {departments.find(d => d.id === doctor.departmentId)?.name}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <p className="text-primary font-medium text-sm">{doctor.specialty}</p>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-600">
                          <GraduationCap className="mr-2 h-4 w-4 text-slate-400" />
                          <span>{doctor.education}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Briefcase className="mr-2 h-4 w-4 text-slate-400" />
                          <span>{doctor.experience} Experience</span>
                        </div>
                        <div className="flex items-start text-sm text-slate-600 mt-4">
                          <Info className="mr-2 h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="line-clamp-3 italic">{doctor.bio}</p>
                        </div>
                      </div>
                      <div className="pt-4 flex gap-3">
                        <Button className="flex-1" render={<Link to="/appointment" />}>
                          <Calendar className="mr-2 h-4 w-4" /> Book
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-slate-900">No doctors found in this department.</h3>
              <p className="mt-2 text-slate-500">Please check back later or select another department.</p>
              <Button variant="link" onClick={() => setSelectedDept("all")} className="mt-4">
                View all doctors
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
