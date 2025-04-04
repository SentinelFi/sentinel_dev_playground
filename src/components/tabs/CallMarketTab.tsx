import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CallMarketTab = () => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Call Market</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          This tab is empty for now.
        </div>
      </CardContent>
    </Card>
  );
};

export default CallMarketTab;
