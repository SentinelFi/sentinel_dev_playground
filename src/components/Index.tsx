"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import DeployTab from "@/components/tabs/DeployTab";
import InitTab from "@/components/tabs/InitTab";
import CallMarketTab from "@/components/tabs/CallMarketTab";
import CallVaultTab from "@/components/tabs/CallVaultTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("deploy");

  // Store tab visibility instead of completely unmounting them
  const [tabVisibility, setTabVisibility] = useState({
    deploy: true,
    init: false,
    "call-market": false,
    "call-vault": false,
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setTabVisibility((prev) => {
      const newVisibility = { ...prev };
      Object.keys(newVisibility).forEach((key) => {
        newVisibility[key as keyof typeof newVisibility] = key === tab;
      });
      return newVisibility;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <div>
          <div style={{ display: tabVisibility["deploy"] ? "block" : "none" }}>
            <DeployTab />
          </div>
          <div style={{ display: tabVisibility["init"] ? "block" : "none" }}>
            <InitTab />
          </div>
          <div
            style={{ display: tabVisibility["call-market"] ? "block" : "none" }}
          >
            <CallMarketTab />
          </div>
          <div
            style={{ display: tabVisibility["call-vault"] ? "block" : "none" }}
          >
            <CallVaultTab />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
