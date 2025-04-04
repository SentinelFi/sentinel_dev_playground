import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="deploy">Deploy</TabsTrigger>
        <TabsTrigger value="init">Init</TabsTrigger>
        <TabsTrigger value="call-market">Call Market</TabsTrigger>
        <TabsTrigger value="call-vault">Call Vault</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;
