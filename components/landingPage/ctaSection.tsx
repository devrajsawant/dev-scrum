import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <div id="#ctaSection" className="pt-15 pb-10 px-5 text-center">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-center">
          Ready to transform your Workflow
        </h3>
        <p className="text-xl mb-10">
          Join thousands of teams already using Dev Scrum to manage their
          projects
        </p>
        <Link href={"/onboarding"}>
          <Button className="animate-bounce">
            Start for free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CtaSection;
