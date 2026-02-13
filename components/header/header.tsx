import Link from "next/link";
import React from "react";
import ActionButtons from "./actionButtons";

const Header = async () => {
  return (
    <header className="container flex justify-between py-5">
      <nav>
        <Link
          href={"/"}
          className="text-3xl sm:text-4xl lg:text-4xl font-extrabold gradient-title"
        >
          Dev Scrum
        </Link>
      </nav>
      <ActionButtons />
    </header>
  );
};

export default Header;
