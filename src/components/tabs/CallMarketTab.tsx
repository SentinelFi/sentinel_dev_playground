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
} from "@/actions/marketCall";

type FunctionParam = {
  name: string;
  type: string;
};

type CategoryWithParams = {
  label: string;
  functions: string[];
  params?: Record<string, FunctionParam[]>;
};

const CallMarketTab = () => {
  const [marketContractId, setMarketContractId] = useState("");
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
        "status",
        "name",
        "description",
        "admin_address",
        "current_contract_address",
        "current_ledger",
        "underlying_asset_address",
        "hedge_address",
        "risk_address",
        "oracle_address",
        "oracle_name",
        "initialized_time",
        "expected_time_of_event",
        "actual_time_of_event",
        "time_until_event",
        "lock_period_in_seconds",
        "time_until_lock",
        "event_threshold_in_seconds",
        "unlock_period_in_seconds",
        "time_of_lock",
        "time_of_unlock",
        "time_until_unlock",
        "risk_score",
        "exercising",
        "commission",
        "liquidated_time",
        "matured_time",
        "last_oracle_time",
        "last_keeper_time",
        "calculate_vault_assets_ratio",
        "calculate_vault_shares_ratio",
        "is_market_paused",
        "extend_market_ttl",
      ],
    },
    "write-no-param": {
      label: "WRITE (No Parameters)",
      functions: [
        "mature",
        "liquidate",
        "dispute",
        "pause_market",
        "unpause_market",
      ],
    },
    "read-with-param": {
      label: "READ (With Parameters)",
      functions: [
        "calculate_hedge_potential_return",
        "calculate_risk_potential_return",
        "market_details",
      ],
      params: {
        calculate_hedge_potential_return: [{ name: "caller", type: "string" }],
        calculate_risk_potential_return: [{ name: "caller", type: "string" }],
        market_details: [{ name: "caller", type: "string" }],
      },
    },
    "write-with-param": {
      label: "WRITE (With Parameters)",
      functions: ["change_oracle", "change_risk_score", "bump"],
      params: {
        change_oracle: [
          { name: "oracle_address", type: "string" },
          { name: "oracle_name", type: "string" },
        ],
        change_risk_score: [{ name: "risk", type: "number" }],
        bump: [
          { name: "event_occurred", type: "boolean" },
          { name: "event_time", type: "number | null" },
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
          marketContractId,
          selectedFunction,
          parsedParams
        );
      } else {
        result = await callWriteContractFunction(
          marketContractId,
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
        <CardTitle>Call Market</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="marketId">Market Contract ID</Label>
              <Input
                id="marketId"
                placeholder="Enter Market Contract ID"
                value={marketContractId}
                onChange={(e) => setMarketContractId(e.target.value)}
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
              disabled={!marketContractId || !selectedFunction || isCalling}
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

export default CallMarketTab;
