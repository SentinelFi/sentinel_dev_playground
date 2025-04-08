"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  callReadContractFunction,
  callWriteContractFunction,
} from "@/actions/vaultCall";

type FunctionParam = {
  name: string;
  type: string;
};

type CategoryWithParams = {
  label: string;
  functions: string[];
  params?: Record<string, FunctionParam[]>;
};

const CallVaultTab = () => {
  const [vaultContractId, setVaultContractId] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [functionCategory, setFunctionCategory] = useState("");
  const [paramValue, setParamValue] = useState<Record<string, any>>({});
  const [responseData, setResponseData] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    getRequiredParams().forEach((param) => {
      initialValues[param.name] = "";
    });
    setParamValue(initialValues);
  }, [selectedFunction]);

  const functionCategories: Record<string, CategoryWithParams> = {
    "read-no-param": {
      label: "READ (No Parameters)",
      functions: [
        "administrator_address",
        "asset_decimals",
        "asset_symbol",
        "asset_name",
        "asset_address",
        "contract_address",
        "total_assets",
        "total_shares",
        "lock_timestamp",
        "unlock_timestamp",
        "is_paused",
        "extend_vault_ttl",
      ],
    },
    "write-no-param": {
      label: "WRITE (No Parameters)",
      functions: [
        "pause",
        "unpause",
        "pause_deposit",
        "pause_withdrawal",
        "unpause_withdrawal",
        "unpause_deposit",
      ],
    },
    "read-with-param": {
      label: "READ (With Parameters)",
      functions: [
        "balance_of_shares",
        "convert_to_shares",
        "convert_to_assets",
        "convert_to_shares_simulate",
        "convert_to_assets_simulate",
        "max_deposit",
        "max_mint",
        "max_withdraw",
        "max_redeem",
        "preview_deposit",
        "preview_mint",
        "preview_withdraw",
        "preview_redeem",
      ],
      params: {
        balance_of_shares: [{ name: "address", type: "string" }],
        convert_to_shares: [{ name: "assets", type: "number" }],
        convert_to_assets: [{ name: "shares", type: "number" }],
        convert_to_shares_simulate: [
          { name: "assets", type: "number" },
          { name: "total_assets", type: "number" },
          { name: "total_shares", type: "number" },
        ],
        convert_to_assets_simulate: [
          { name: "shares", type: "number" },
          { name: "total_shares", type: "number" },
          { name: "total_assets", type: "number" },
        ],
        max_deposit: [{ name: "_address", type: "string" }],
        max_mint: [{ name: "_address", type: "string" }],
        max_withdraw: [{ name: "owner", type: "string" }],
        max_redeem: [{ name: "owner", type: "string" }],
        preview_deposit: [{ name: "assets", type: "number" }],
        preview_mint: [{ name: "shares", type: "number" }],
        preview_withdraw: [{ name: "assets", type: "number" }],
        preview_redeem: [{ name: "shares", type: "number" }],
      },
    },
    "write-with-param": {
      label: "WRITE (With Parameters)",
      functions: [
        "deposit",
        "mint",
        "withdraw",
        "redeem",
        "approve_shares",
        "transfer_shares",
        "approve_asset_allowance",
      ],
      params: {
        deposit: [
          { name: "assets", type: "number" },
          { name: "caller", type: "string" },
          { name: "receiver", type: "string" },
        ],
        mint: [
          { name: "shares", type: "number" },
          { name: "caller", type: "string" },
          { name: "receiver", type: "string" },
        ],
        withdraw: [
          { name: "assets", type: "number" },
          { name: "caller", type: "string" },
          { name: "receiver", type: "string" },
          { name: "owner", type: "string" },
        ],
        redeem: [
          { name: "shares", type: "number" },
          { name: "caller", type: "string" },
          { name: "receiver", type: "string" },
          { name: "owner", type: "string" },
        ],
        approve_shares: [
          { name: "owner", type: "string" },
          { name: "spender", type: "string" },
          { name: "approve_amount", type: "number" },
          { name: "expire_in_days", type: "number" },
        ],
        transfer_shares: [
          { name: "owner", type: "string" },
          { name: "receiver", type: "string" },
          { name: "shares_amount", type: "number" },
        ],
        approve_asset_allowance: [
          { name: "asset_address", type: "string" },
          { name: "spender", type: "string" },
          { name: "approve_amount", type: "number" },
          { name: "expiration_ledger", type: "number" },
        ],
      },
    },
  };

  const getRequiredParams = () => {
    if (!selectedFunction || !functionCategory) return [];

    const category = functionCategories[functionCategory];
    if (!category || !category.params) return [];

    return category.params[selectedFunction] || [];
  };

  const handleCategoryChange = (value: string) => {
    setFunctionCategory(value);
    setSelectedFunction("");
    setParamValue({});
  };

  const handleFunctionChange = (value: string) => {
    setSelectedFunction(value);
    setParamValue({});
  };

  const handleCallFunction = async () => {
    try {
      setIsCalling(true);
      setResponseData("");

      const requiredParams = getRequiredParams();
      console.log("Required Params:", requiredParams);

      let parsedParams = {};

      requiredParams.forEach((param) => {
        if (param.type === "number") {
          parsedParams = {
            ...parsedParams,
            [param.name]: Number(paramValue[param.name]),
          };
        } else if (param.type === "boolean") {
          parsedParams = {
            ...parsedParams,
            [param.name]:
              paramValue[param.name].toLowerCase() === "true" ||
              paramValue[param.name].toLowerCase() === "1",
          };
        } else {
          parsedParams = {
            ...parsedParams,
            [param.name]: paramValue[param.name],
          };
        }
      });

      console.log(
        "Calling fn: ",
        selectedFunction,
        " - params: ",
        parsedParams
      );

      let result: string = "";

      if (
        functionCategory === "read-no-param" ||
        functionCategory === "read-with-param"
      ) {
        result = await callReadContractFunction(
          vaultContractId,
          selectedFunction,
          parsedParams
        );
      } else {
        result = await callWriteContractFunction(
          vaultContractId,
          selectedFunction,
          parsedParams
        );
      }

      console.log("Market fn call:", result);
      setResponseData(result);
    } catch (e) {
      console.log("Market Error:", e);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Call Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="vaultId">Vault Contract ID</Label>
              <Input
                id="vaultId"
                placeholder="Enter Vault Contract ID"
                value={vaultContractId}
                onChange={(e) => setVaultContractId(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="functionCategory">Function Category</Label>
              <Select
                value={functionCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(functionCategories).map(
                      ([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.label}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {functionCategory && (
              <div className="grid gap-2">
                <Label htmlFor="function">Function Name</Label>
                <Select
                  value={selectedFunction}
                  onValueChange={handleFunctionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {functionCategories[functionCategory].functions.map(
                        (func) => (
                          <SelectItem key={func} value={func}>
                            {func}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedFunction && getRequiredParams().length > 0 && (
              <div className="grid gap-4">
                <Label>Parameters</Label>
                {getRequiredParams().map((param, index) => (
                  <div key={index} className="grid gap-2">
                    <Label htmlFor={param.name}>
                      {param.name} ({param.type})
                    </Label>
                    <Input
                      id={param.name}
                      placeholder={`Enter ${param.name}`}
                      value={paramValue[param.name] || ""}
                      onChange={(e) =>
                        setParamValue({
                          ...paramValue,
                          [param.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              className="w-full"
              disabled={!vaultContractId || !selectedFunction || isCalling}
              onClick={handleCallFunction}
            >
              {isCalling ? "Calling..." : "Call Function"}
            </Button>
          </div>
        </form>

        {responseData && (
          <div className="mt-6">
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
              {responseData}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CallVaultTab;
