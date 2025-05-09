import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="container flex h-20 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            width={64}
            height={64}
            priority
            alt="Logo of the project"
          />
          <h1 className="text-xl font-bold">Sentinel Dev Playground</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com/SentinelFi/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
