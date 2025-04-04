import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

const DeployTab = () => {
  const [isDeployed, setIsDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const contracts = {
    market: "GC...",
    hedge: "GB...",
    risk: "GC...",
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    // Simulate deployment delay
    setTimeout(() => {
      setIsDeployed(true);
      setIsDeploying(false);
    }, 2000);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Deploy New Market</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="font-medium">Account:</span>
              <span className="ml-2">Generated Random</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Network:</span>
              <span className="ml-2">Testnet</span>
            </div>
          </div>

          {!isDeployed ? (
            <Button
              className="w-full"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? "Deploying..." : "Deploy"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="text-lg font-semibold text-green-600">
                Deployment Successful!
              </div>

              <div className="rounded-md border p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Smart Contract Addresses:</h3>
                <div className="space-y-2">
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      Market Contract:
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-xs bg-muted p-1 rounded">
                        {contracts.market}
                      </code>
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${contracts.market}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-stellar hover:underline"
                      >
                        View <ArrowUpRight size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      Hedge Vault:
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-xs bg-muted p-1 rounded">
                        {contracts.hedge}
                      </code>
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${contracts.hedge}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-stellar hover:underline"
                      >
                        View <ArrowUpRight size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      Risk Vault:
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-xs bg-muted p-1 rounded">
                        {contracts.risk}
                      </code>
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${contracts.risk}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-stellar hover:underline"
                      >
                        View <ArrowUpRight size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsDeployed(false)}
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeployTab;
