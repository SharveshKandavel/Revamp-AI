
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Monitor, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const initialBuilds = [
  {
    id: 1,
    client: "John Doe",
    purpose: "Gaming",
    budget: 150000,
    status: "pending",
    date: "2024-04-18",
  },
  {
    id: 2,
    client: "Jane Smith",
    purpose: "Video Editing",
    budget: 200000,
    status: "completed",
    date: "2024-04-17",
  },
  {
    id: 3,
    client: "Mike Johnson",
    purpose: "Programming",
    budget: 120000,
    status: "pending",
    date: "2024-04-16",
  }
];

const RecentBuilds = () => {
  const [builds, setBuilds] = useState(initialBuilds);

  const toggleStatus = (id: number) => {
    setBuilds(currentBuilds => 
      currentBuilds.map(build => 
        build.id === id 
          ? { ...build, status: build.status === "completed" ? "pending" : "completed" }
          : build
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-tech-purple" />
          Recent Build Requests
        </CardTitle>
        <CardDescription>Click on a build to toggle its status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {builds.map((build) => (
            <div
              key={build.id}
              onClick={() => toggleStatus(build.id)}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-tech-purple transition-colors cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {build.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {build.client}
                    <Badge variant={build.status === "completed" ? "default" : "secondary"} className={build.status === "completed" ? "bg-green-100 text-green-800" : ""}>
                      {build.status}
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {build.purpose} Build - ₹{build.budget.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">{build.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBuilds;
