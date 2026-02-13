import { Heart } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-900 py-5 gap-2">
      <p> Developed with</p>
      <Heart /> <p> by Devraj</p>
    </div>
  );
};

export default Footer;
