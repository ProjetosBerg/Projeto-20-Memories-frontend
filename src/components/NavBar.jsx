import { Link } from "react-router-dom";

import useSearch from "../Hooks/useSearch";

import "../components/NavBar.css";

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch()

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="navbar">
      <h2>
        <Link to="/">Memories</Link>
      </h2>
      <form className="search-form"  onChange={handleSearchChange} >
        <input
          type="text"
          placeholder="Buscar pelo titulo ..."
          value={searchQuery}
        />
      </form>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li className="add">
          <Link to="/add-memory">Adicionar Memória</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
