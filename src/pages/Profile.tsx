import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, collection, query, where, onSnapshot, OperationType, handleFirestoreError } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  patientName: string;
  departmentId: string;
  doctorId: string;
  date: string;
  status: string;
  createdAt: any;
}

export default function Profile() {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "appointments"), where("patientUid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "appointments"));

    return unsubscribe;
  }, [user]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm">
              <CardHeader className="text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <CardTitle>{user.displayName || "Patient"}</CardTitle>
                <CardDescription>Member since {user.metadata.creationTime ? format(new Date(user.metadata.creationTime), "PPP") : "N/A"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-primary" />
                  {user.email}
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-primary" />
                    {user.phoneNumber}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  My Appointments
                </CardTitle>
                <CardDescription>View your upcoming and past medical visits.</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doctor / Dept</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div className="font-medium">{app.doctorId}</div>
                            <div className="text-xs text-slate-500 capitalize">{app.departmentId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{format(new Date(app.date), "PPp")}</div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={cn(
                                "capitalize",
                                app.status === 'confirmed' ? "bg-green-100 text-green-700 hover:bg-green-100" : 
                                app.status === 'cancelled' ? "bg-red-100 text-red-700 hover:bg-red-100" : 
                                "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                              )}
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
                    <p className="text-slate-500 mt-1">You haven't booked any appointments yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
