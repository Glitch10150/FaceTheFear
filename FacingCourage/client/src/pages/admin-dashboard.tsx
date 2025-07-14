import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Users, Shield, LogOut, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import type { Application } from "@shared/schema";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/applications", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update application status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const getStatusCounts = () => {
    if (!applications) return { pending: 0, approved: 0, rejected: 0 };
    return applications.reduce((acc, app) => {
      acc[app.status as keyof typeof acc]++;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0 });
  };

  const filteredApplications = (status: string) => {
    return applications?.filter(app => app.status === status) || [];
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark-bg)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--gta-orange)]"></div>
          <p className="mt-4 text-gray-300">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white">
      {/* Header */}
      <header className="bg-[var(--dark-surface)] border-b border-[var(--gta-orange)]/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-[var(--gta-orange)]" />
            <h1 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)]">
              ADMIN DASHBOARD
            </h1>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-[var(--gta-orange)] text-[var(--gta-orange)] hover:bg-[var(--gta-orange)] hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="faction-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-[var(--gta-gold)] font-[Orbitron] flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{statusCounts.pending}</div>
            </CardContent>
          </Card>

          <Card className="faction-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-[var(--gta-gold)] font-[Orbitron] flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{statusCounts.approved}</div>
            </CardContent>
          </Card>

          <Card className="faction-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-[var(--gta-gold)] font-[Orbitron] flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{statusCounts.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[var(--dark-surface)]">
            <TabsTrigger value="pending" className="data-[state=active]:bg-[var(--gta-orange)] data-[state=active]:text-black">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-[var(--gta-orange)] data-[state=active]:text-black">
              Approved ({statusCounts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-[var(--gta-orange)] data-[state=active]:text-black">
              Rejected ({statusCounts.rejected})
            </TabsTrigger>
          </TabsList>

          {["pending", "approved", "rejected"].map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              <div className="grid gap-4">
                {filteredApplications(status).map((application) => (
                  <Card key={application.id} className="faction-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <h3 className="text-xl font-[Orbitron] font-bold text-[var(--gta-gold)]">
                              {application.username}
                            </h3>
                            <Badge className={`status-badge ${getStatusColor(application.status)}`}>
                              {application.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-400">Discord</p>
                              <p className="text-white">{application.discord}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Experience</p>
                              <p className="text-white capitalize">{application.experience}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Preferred Role</p>
                              <p className="text-white capitalize">{application.role}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Submitted</p>
                              <p className="text-white">
                                {formatDistanceToNow(new Date(application.submittedAt || Date.now()))} ago
                              </p>
                            </div>
                            {application.reviewedBy && application.status !== "pending" && (
                              <div>
                                <p className="text-sm text-gray-400">Reviewed by</p>
                                <p className="text-white font-medium">{application.reviewedBy}</p>
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-400">Availability</p>
                            <p className="text-white">
                              {JSON.parse(application.availability).join(", ")}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[var(--gta-orange)] text-[var(--gta-orange)] hover:bg-[var(--gta-orange)] hover:text-black"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          
                          {application.status === "pending" && (
                            <div className="flex flex-col space-y-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "approved" })}
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "rejected" })}
                                disabled={updateStatusMutation.isPending}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredApplications(status).length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No {status} applications found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="faction-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-[var(--gta-gold)] font-[Orbitron] flex items-center justify-between">
                Application Details
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Username</p>
                  <p className="text-white font-medium">{selectedApplication.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Discord</p>
                  <p className="text-white font-medium">{selectedApplication.discord}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="text-white font-medium capitalize">{selectedApplication.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Preferred Role</p>
                  <p className="text-white font-medium capitalize">{selectedApplication.role}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Availability</p>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(selectedApplication.availability).map((day: string) => (
                    <Badge key={day} variant="secondary" className="capitalize">
                      {day === "nights" ? "Late Nights" : day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Why do you want to join Face the Fear?</p>
                <div className="bg-[var(--dark-bg)] p-4 rounded-lg">
                  <p className="text-white whitespace-pre-wrap">{selectedApplication.motivation}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Why should we accept you in our team?</p>
                <div className="bg-[var(--dark-bg)] p-4 rounded-lg">
                  <p className="text-white whitespace-pre-wrap">{selectedApplication.whyAcceptYou}</p>
                </div>
              </div>

              {selectedApplication.previousGroups && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Previous Gaming Groups</p>
                  <div className="bg-[var(--dark-bg)] p-4 rounded-lg">
                    <p className="text-white whitespace-pre-wrap">{selectedApplication.previousGroups}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge className={`status-badge ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status}
                  </Badge>
                  {selectedApplication.reviewedBy && selectedApplication.status !== "pending" && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">Reviewed by</p>
                      <p className="text-white font-medium">{selectedApplication.reviewedBy}</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Submitted</p>
                  <p className="text-white">
                    {formatDistanceToNow(new Date(selectedApplication.submittedAt || Date.now()))} ago
                  </p>
                  {selectedApplication.reviewedAt && selectedApplication.status !== "pending" && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">Reviewed</p>
                      <p className="text-white">
                        {formatDistanceToNow(new Date(selectedApplication.reviewedAt))} ago
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedApplication.status === "pending" && (
                <div className="flex space-x-4 pt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    onClick={() => {
                      updateStatusMutation.mutate({ id: selectedApplication.id, status: "approved" });
                      setSelectedApplication(null);
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white flex-1"
                    onClick={() => {
                      updateStatusMutation.mutate({ id: selectedApplication.id, status: "rejected" });
                      setSelectedApplication(null);
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}