import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className=" flex gap-6 p-4">
      <nav>
        <Link
          href={"/"}
          className=" font-bold text-2xl text-gray-900 hover:text-red-300 ease-in-out duration-300"
        >
          PokaZoo
        </Link>
      </nav>
    </header>
  );
};

export default Header;
