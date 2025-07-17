// import { useEffect, useState } from "react";
// import axios from "axios";

// const Dashboard = () => {
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalFerries, setTotalFerries] = useState(0);
//   const [totalSchedule, setTotalSchedule] = useState(0);

//   useEffect(() => {
//     const fetchTotalUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/total-users");
//         setTotalUsers(response.data.totalUsers);
//       } catch (error) {
//         console.error("Error fetching total users:", error);
//       }
//     };

//     fetchTotalUsers();
//   }, []);

//   useEffect(() => {
//     const fetchTotalFerries = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/ferry-count");
//         setTotalFerries(response.data.totalFerries);
//       } catch (error) {
//         console.error("Error fetching total ferries:", error);
//       }
//     };

//     fetchTotalFerries();
//   }, []);

//   useEffect(() => {
//     const fetchTotalSchedule = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/schedule-count");
//         setTotalSchedule(response.data.totalSchedule);
//       } catch (error) {
//         console.error("Error fetching total schedule:", error);
//       }
//     };

//     fetchTotalSchedule();

//   }, []);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-4xl font-semibold text-gray-700 text-center mb-6">Admin Dashboard</h2>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
//           <h2 className="text-xl font-semibold">Total Users</h2>
//           <p className="text-3xl font-bold mt-2">{totalUsers}</p>
//         </div>

//         <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500">
//           <h2 className="text-xl font-semibold">Total Ferry</h2>
//           <p className="text-3xl font-bold mt-2">{totalFerries}</p>
//         </div>

//         <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-yellow-500">
//           <h2 className="text-xl font-semibold">Total Schedule</h2>
//           <p className="text-3xl font-bold mt-2">{totalSchedule}</p>
//         </div>

//       </div>

//       <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2">User</th>
//                 <th className="p-2">Action</th>
//                 <th className="p-2">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-t">
//                 <td className="p-2">John Doe</td>
//                 <td className="p-2">Logged in</td>
//                 <td className="p-2">Feb 26, 2025</td>
//               </tr>
//               <tr className="border-t">
//                 <td className="p-2">Jane Smith</td>
//                 <td className="p-2">Updated profile</td>
//                 <td className="p-2">Feb 25, 2025</td>
//               </tr>
//               <tr className="border-t">
//                 <td className="p-2">Alice Johnson</td>
//                 <td className="p-2">Changed password</td>
//                 <td className="p-2">Feb 24, 2025</td>
//               </tr>
//               <tr className="border-t">
//                 <td className="p-2">Bob Brown</td>
//                 <td className="p-2">Requested admin access</td>
//                 <td className="p-2">Feb 23, 2025</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, Ship, CalendarClock, Ticket   } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalFerries: 0, totalSchedule: 0, totalBookings: 0 });
  const [bookingDistribution, setBookingDistribution] = useState([]);
  const COLORS = ["#34D399", "#60A5FA", "#F87171", "#FBBF24", "#A78BFA"]; // You can expand this
  const [filter, setFilter] = useState("daily");
  const bookings = {
    daily: [
      { name: "Booked", value: 240 },
      { name: "Cancelled", value: 60 },
    ],
    weekly: [
      { name: "Booked", value: 1200 },
      { name: "Cancelled", value: 300 },
    ],
    monthly: [
      { name: "Booked", value: 4800 },
      { name: "Cancelled", value: 1100 },
    ]
  };

  // const COLORS = ["#34D399", "#F87171"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, ferries, schedule, booking] = await Promise.all([
          axios.get("http://localhost:5000/api/total-users"),
          axios.get("http://localhost:5000/api/ferry-count"),
          axios.get("http://localhost:5000/api/schedule-count"),
          axios.get("http://localhost:5000/api/Bookingcount"),
        ]);

        setStats({
          totalUsers: users.data.totalUsers,
          totalFerries: ferries.data.totalFerries,
          totalSchedule: schedule.data.totalSchedule,
          totalBookings: booking.data.totalBookings,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchBookingDistribution = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/booking-distribution");
        setBookingDistribution(res.data);
      } catch (err) {
        console.error("Error fetching booking distribution:", err);
      }
    };

    fetchBookingDistribution();
  }, []);

  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Ferries", value: stats.totalFerries },
    { name: "Schedules", value: stats.totalSchedule },
    { name: "Bookings", value: stats.totalBookings },
  ];

  const statsCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users className="text-blue-500" size={30} /> },
    { label: "Total Ferries", value: stats.totalFerries, icon: <Ship className="text-green-500" size={30} /> },
    { label: "Total Schedules", value: stats.totalSchedule, icon: <CalendarClock className="text-yellow-500" size={30} /> },
    { label: "Total Bookings", value: stats.totalBookings, icon: <Ticket  className="text-red-500" size={30} /> },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-700 text-center mb-10">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, i) => (
          <div
            key={i}
            className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 tracking-wide">{card.label}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 text-xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">System Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 10, borderColor: "#e5e7eb" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4"> Booking Analysis by Class</h3>
          {bookingDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={bookingDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 10, borderColor: "#e5e7eb" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">Loading chart...</p>
          )}
        </div>

      </div>

      {/* Recent Activities Table */}
      <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[
                { user: "John Doe", action: "Logged in", date: "Feb 26, 2025" },
                { user: "Jane Smith", action: "Updated profile", date: "Feb 25, 2025" },
                { user: "Alice Johnson", action: "Changed password", date: "Feb 24, 2025" },
                { user: "Bob Brown", action: "Requested admin access", date: "Feb 23, 2025" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-all duration-150">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.user}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {row.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

