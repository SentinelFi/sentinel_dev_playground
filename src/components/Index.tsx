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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "deploy":
        return <DeployTab />;
      case "init":
        return <InitTab />;
      case "call-market":
        return <CallMarketTab />;
      case "call-vault":
        return <CallVaultTab />;
      default:
        return <DeployTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div>{renderActiveTab()}</div>
      </main>
    </div>
  );
};

export default Index;
