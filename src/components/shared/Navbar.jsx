import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-zinc-100 dark:bg-zinc-900 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">PetAdopt</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/pets" className="hover:underline">Pets</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </nav>
  );
}
