import { useState, useEffect } from "react";
import axios from "axios";

const ContactManagement = () => {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10;

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-contacts");
      setAgents(response.data);
      setFilteredAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    const filtered = agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(term.toLowerCase()) ||
        agent.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAgents(filtered);
    setCurrentPage(1);
  };

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);

  return (
    <div className="h-screen p-6 bg-gray-100">
      <h2 className="text-4xl font-semibold text-gray-700 text-center mb-6">Contact Management</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearch}
          className="w-72 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
        />
      </div>

      <div className="overflow-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {currentAgents.length > 0 ? (
              currentAgents.map((agent, index) => (
                <tr key={agent._id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-4">{indexOfFirstAgent + index + 1}</td>
                  <td className="p-4">{agent.name}</td>
                  <td className="p-4">{agent.email}</td>
                  <td className="p-4">{agent.phone}</td>
                  <td className="p-4">{agent.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">No agents available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Prev
        </button>
        <span className="text-gray-700 text-lg font-semibold">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastAgent >= filteredAgents.length}
          className={`px-4 py-2 rounded-lg ${indexOfLastAgent >= filteredAgents.length ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ContactManagement;