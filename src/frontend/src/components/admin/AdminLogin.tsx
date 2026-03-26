import { Shield } from "lucide-react";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "aflino2024") {
      localStorage.setItem("aflino_admin_auth", "1");
      onLogin();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div
      data-ocid="admin.login.page"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-blue-200">
            <Shield className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Aflino
          </h1>
          <p className="text-sm text-blue-500 font-medium mt-0.5">
            Admin Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-semibold text-gray-700"
              htmlFor="admin-password"
            >
              Password
            </label>
            <input
              id="admin-password"
              data-ocid="admin.login.input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter admin password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            />
            {error && (
              <p
                data-ocid="admin.login.error_state"
                className="text-red-500 text-xs mt-0.5"
              >
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            data-ocid="admin.login.submit_button"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition-colors duration-150 text-sm shadow-sm shadow-blue-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Aflino Browser. All rights reserved.
        </p>
      </div>
    </div>
  );
}
