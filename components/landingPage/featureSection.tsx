import { BarChart, Calendar, Layout } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "../ui/card";

const FeatureSection = () => {
  const features = [
    {
      title: "Intuitive Kanban Boards",
      description:
        "Visualize your workflow and optimize team productivity with easy-to-use Kanban boards.",
      icon: Layout,
    },
    {
      title: "Powerful Sprint Planning",
      description:
        "Plan and manage sprints effectively to keep your team focused on delivering value.",
      icon: Calendar,
    },
    {
      title: "Comprehensive Reporting",
      description:
        "Get insights into your team's performance with customizable reports and analytics.",
      icon: BarChart,
    },
  ];

  return (
    <div id="#features" className="bg-gray-900 py-20 px-5">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            return (
              <Card key={index} className="bg-gray-800">
                <CardContent className="pt-3">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-400" />
                  <CardTitle className="font-semibold text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardContent>
                
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
