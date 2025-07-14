import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Application } from "@shared/schema";

export default function ApplicationStatus() {
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

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

  const getStatusSteps = (status: string) => {
    const steps = [
      { name: "Application received", completed: true },
      { name: "Under review by leadership", completed: status !== "pending" },
      { name: "Interview scheduled", completed: status === "approved" },
      { name: "Final decision", completed: status === "approved" || status === "rejected" },
    ];
    return steps;
  };

  if (isLoading) {
    return (
      <Card className="faction-card p-8">
        <CardContent className="p-0">
          <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-6">APPLICATION STATUS</h3>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--gta-orange)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the most recent application (sort by submission date descending)
  const latestApplication = applications?.sort((a, b) => 
    new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
  )[0];

  return (
    <Card className="faction-card p-8">
      <CardContent className="p-0">
        <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-6">APPLICATION STATUS</h3>
        {latestApplication ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--dark-bg)] rounded-lg">
              <div>
                <span className="text-white font-medium">{latestApplication.username}</span>
                <p className="text-sm text-gray-400">
                  Applied {formatDistanceToNow(new Date(latestApplication.submittedAt || Date.now()))} ago
                </p>
                {latestApplication.reviewedBy && latestApplication.status !== "pending" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed by {latestApplication.reviewedBy}
                    {latestApplication.reviewedAt && (
                      <> • {formatDistanceToNow(new Date(latestApplication.reviewedAt))} ago</>
                    )}
                  </p>
                )}
              </div>
              <Badge className={`status-badge ${getStatusColor(latestApplication.status)}`}>
                {latestApplication.status}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-300 space-y-2">
              {getStatusSteps(latestApplication.status).map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    step.completed ? 'bg-green-500' : 
                    index === 1 && latestApplication.status === 'pending' ? 'bg-[var(--gta-orange)]' : 
                    'bg-gray-500'
                  }`}></div>
                  <span>{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No applications submitted yet.</p>
            <p className="text-sm text-gray-500 mt-2">Submit your application to track its status here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
