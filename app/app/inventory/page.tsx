"use client";
// app/dashboard/page.tsx
import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function Inventory() {
  // Data dummy untuk chart inventory
  const stockMovementData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Stock In",
        data: [450, 520, 480, 600],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Stock Out",
        data: [380, 490, 430, 550],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topProductsData = {
    labels: [
      "Hijab Rifa",
      "Ori Mukenah",
      "Cargo Loos Pants",
      "Sandal Wanita",
      "Tas Ransel",
    ],
    datasets: [
      {
        label: "Units Sold",
        data: [120, 95, 80, 65, 45],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <DashboardLayout
      config={{
        title: "Inventory",
        moduleItems: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Stock", href: "/dashboard/analytics" },
          { label: "Product", href: "/dashboard/settings" },
          { label: "Code Product", href: "/dashboard/settings" },
          { label: "Report", href: "/dashboard/settings" },
        ],
      }}
    >
      <main className="min-h-screen p-4 space-y-6">
        {/* Stat Cards - Inventory Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-blue-600">156</p>
            <p className="text-sm text-gray-500 mt-2">+12 from last month</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Stock Value
            </h3>
            <p className="text-3xl font-bold text-green-600">Rp 87.2M</p>
            <p className="text-sm text-gray-500 mt-2">+8.3% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Low Stock Items
            </h3>
            <p className="text-3xl font-bold text-orange-600">23</p>
            <p className="text-sm text-gray-500 mt-2">Need reorder</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categories
            </h3>
            <p className="text-3xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-500 mt-2">Active categories</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Movement Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Stock Movement
            </h2>
            <div className="h-80">
              <Line data={stockMovementData} options={chartOptions} />
            </div>
          </div>

          {/* Top Products Chart (dengan data produk yang diberikan) */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Top Selling Products
            </h2>
            <div className="h-80">
              <Bar data={topProductsData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Inventory
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Hijab Rifa
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Hijab
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    120
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp 85K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Ori Mukenah
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mukenah
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    95
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp 150K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Cargo Loos Pants
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Pants
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    80
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp 200K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Low Stock
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Sandal Wanita
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Footwear
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    65
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp 75K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Low Stock
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Tas Ransel
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Bags
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    45
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp 250K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Critical
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Low Stock Alert
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="font-medium">Cargo Loos Pants</span>
              </div>
              <span className="text-sm text-gray-600">Only 80 left</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="font-medium">Sandal Wanita</span>
              </div>
              <span className="text-sm text-gray-600">Only 65 left</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="font-medium">Tas Ransel</span>
              </div>
              <span className="text-sm text-gray-600">
                Only 45 left (Reorder now)
              </span>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
