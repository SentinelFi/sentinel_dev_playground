import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { deployMarket } from "@/actions/deploy";
import { toast } from "sonner";
import Link from "next/link";

const DeployTab = () => {
  const [isDeployed, setIsDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [hedgeContract, setHedgeContract] = useState("");
  const [riskContract, setRiskContract] = useState("");
  const [marketContract, setMarketContract] = useState("");

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      const ids = await deployMarket();
      if (!ids || ids.length < 3) {
        toast.error("Please fill in all required fields");
        return;
      }
      console.log("Deployed:", ids);
      setHedgeContract(ids[0]);
      setRiskContract(ids[1]);
      setMarketContract(ids[2]);
      setIsDeployed(true);
    } catch (e) {
      console.log("Deploy Error:", e);
      setHedgeContract("");
      setRiskContract("");
      setMarketContract("");
      setIsDeployed(false);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Deploy New Market</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center">
              <span className="font-medium">Account:</span>
              <span className="ml-2">Random Generated</span>
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
                        {marketContract}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(marketContract)}
                      >
                        Copy
                      </Button>
                      <Link
                        href={`https://stellar.expert/explorer/testnet/contract/${marketContract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-stellar hover:underline"
                      >
                        View <ArrowUpRight size={12} className="ml-1" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      Hedge Vault:
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-xs bg-muted p-1 rounded">
                        {hedgeContract}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(hedgeContract)}
                      >
                        Copy
                      </Button>
                      <Link
                        href={`https://stellar.expert/explorer/testnet/contract/${hedgeContract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-stellar hover:underline"
                      >
                        View <ArrowUpRight size={12} className="ml-1" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      Risk Vault:
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-xs bg-muted p-1 rounded">
                        {riskContract}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(riskContract)}
                      >
                        Copy
                      </Button>
                      <Link
                        href={`https://stellar.expert/explorer/testnet/contract/${riskContract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-stellar hover:underline"
                      >
                        View <ArrowUpRight size={12} className="ml-1" />
                      </Link>
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
