import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { initMarket } from "@/actions/init";

const InitTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");

  const [formData, setFormData] = useState({
    marketContractId: "",
    network: "testnet",
    name: "",
    description: "",
    adminAddress: "",
    assetAddress: "",
    oracleAddress: "",
    oracleName: "",
    hedgeVaultAddress: "",
    riskVaultAddress: "",
    commissionFee: "",
    riskScore: "",
    isAutomatic: true,
    eventTimestamp: "",
    lockPeriod: "",
    unlockPeriod: "",
  });

  const generateRandomAddress = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let result = "G";
    for (let i = 0; i < 55; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      setIsSubmitting(true);
      setResult("");

      // const requiredFields = Object.entries(formData).filter(
      //   ([key]) => key !== ""
      // );
      // const emptyFields = requiredFields.filter(([_, value]) => !value);
      // if (emptyFields.length > 0) {
      //   toast.error("Please fill in all required fields");
      //   return;
      // }

      console.log("Market:", formData.marketContractId);

      const returnedResult = await initMarket(formData.marketContractId);

      console.log("Init:", returnedResult);
      setResult(returnedResult);

      toast.success("Market initialized!");
    } catch (e: any) {
      setResult(e.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const setTimestampFromNow = (days: number) => {
    const now = new Date();
    now.setDate(now.getDate() + days);
    setFormData((prev) => ({
      ...prev,
      eventTimestamp: Math.floor(now.getTime() / 1000).toString(),
    }));
  };

  const fillAssetAddress = (type: "USDC" | "XLM") => {
    setFormData((prev) => ({
      ...prev,
      assetAddress:
        type === "USDC"
          ? "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
          : "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Initialize New Market</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="marketContractId">Market Contract ID</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the contract ID from deployed market contract</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="marketContractId"
                name="marketContractId"
                placeholder="Enter market contract ID"
                value={formData.marketContractId}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="network">Network</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the blockchain network</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                defaultValue="testnet"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, network: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testnet">Testnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name">Name</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter a name for this market</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="name"
                name="name"
                placeholder="Enter market name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="description">Description</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter a description for this market</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="description"
                name="description"
                placeholder="Enter market description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="adminAddress">Admin Address</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stellar address of the market admin</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="adminAddress"
                  name="adminAddress"
                  placeholder="Enter admin address"
                  value={formData.adminAddress}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      adminAddress: generateRandomAddress(),
                    }))
                  }
                >
                  Random
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="assetAddress">Asset Address</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Address of the asset used in this market</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-col space-y-2">
                <Input
                  id="assetAddress"
                  name="assetAddress"
                  placeholder="Enter asset address"
                  value={formData.assetAddress}
                  onChange={handleInputChange}
                />
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => fillAssetAddress("USDC")}
                  >
                    Fill USDC
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => fillAssetAddress("XLM")}
                  >
                    Fill XLM
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="oracleAddress">Oracle Address</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Address of the oracle that provides data to this market
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="oracleAddress"
                  name="oracleAddress"
                  placeholder="Enter oracle address"
                  value={formData.oracleAddress}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      oracleAddress: generateRandomAddress(),
                    }))
                  }
                >
                  Random
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="oracleName">Oracle Name</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Name of the oracle provider</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="oracleName"
                name="oracleName"
                placeholder="Enter oracle name"
                value={formData.oracleName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="hedgeVaultAddress">Hedge Vault Address</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Address of the hedge vault for this market</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="hedgeVaultAddress"
                name="hedgeVaultAddress"
                placeholder="Enter hedge vault address"
                value={formData.hedgeVaultAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="riskVaultAddress">Risk Vault Address</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Address of the risk vault for this market</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="riskVaultAddress"
                name="riskVaultAddress"
                placeholder="Enter risk vault address"
                value={formData.riskVaultAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="commissionFee">Commission Fee (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Commission fee percentage (0-100)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="commissionFee"
                name="commissionFee"
                type="number"
                min="0"
                max="100"
                placeholder="Enter commission fee"
                value={formData.commissionFee}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="riskScore">Risk Score</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Risk score (0-3)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, riskScore: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Low Risk</SelectItem>
                  <SelectItem value="1">1 - Medium Risk</SelectItem>
                  <SelectItem value="2">2 - High Risk</SelectItem>
                  <SelectItem value="3">3 - Unknown Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="isAutomatic">Is Automatic</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Whether the market is automatically managed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAutomatic"
                  checked={formData.isAutomatic}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isAutomatic: checked }))
                  }
                />
                <Label htmlFor="isAutomatic">
                  {formData.isAutomatic ? "Yes" : "No"}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="eventTimestamp">Event Unix Timestamp</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unix timestamp of the market event</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link
                  href={`https://www.unixtimestamp.com/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-stellar hover:underline"
                >
                  https://www.unixtimestamp.com/
                </Link>
              </div>
              <div className="flex flex-col space-y-2">
                <Input
                  id="eventTimestamp"
                  name="eventTimestamp"
                  placeholder="Enter event timestamp"
                  value={formData.eventTimestamp}
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-5 gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setTimestampFromNow(1)}
                  >
                    1 Day
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setTimestampFromNow(7)}
                  >
                    1 Week
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setTimestampFromNow(30)}
                  >
                    1 Month
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setTimestampFromNow(90)}
                  >
                    3 Months
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setTimestampFromNow(180)}
                  >
                    6 Months
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="lockPeriod">Lock Period (seconds)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lock period in seconds</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="lockPeriod"
                name="lockPeriod"
                type="number"
                min="0"
                placeholder="Enter lock period"
                value={formData.lockPeriod}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="unlockPeriod">Unlock Period (seconds)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unlock period in seconds</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="unlockPeriod"
                name="unlockPeriod"
                type="number"
                min="0"
                placeholder="Enter unlock period"
                value={formData.unlockPeriod}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Initializing..." : "Initialize Market"}
          </Button>
        </form>
        {result && (
          <p className="text-center mt-4">
            Result: <span>{result}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default InitTab;
