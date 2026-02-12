import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold gradient-title flex flex-col">
        Streamline Your Workflow
        with
        <br />
        <span className="text-6xl sm:text-7xl lg:text-8xl">DEV SCRUM</span>
      </h1>
      <p className="text-xl text-gray-300 mb-8 mt-4 max-w-3xl mx-auto">
        Manage multiple projects and teams with our project management system
      </p>
      <Link href={"/onboarding"} className="mr-4" >
        <Button>
          Get Started <ChevronRight size={18} />
        </Button>
      </Link>
      <Link href="#features">
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </Link>
    </div>
  );
};

export default HeroSection;
