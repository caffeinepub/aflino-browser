import { ShieldBan, ShieldCheck, Trash2, Users } from "lucide-react";
import { useShortcutsStore } from "../../useShortcutsStore";

export function UserDatabaseSection() {
  const { registeredUsers, blockUser, deleteUser } = useShortcutsStore();

  function handleDelete(id: string, email: string) {
    if (
      window.confirm(`Delete user "${email}"? This action cannot be undone.`)
    ) {
      deleteUser(id);
    }
  }

  return (
    <div data-ocid="admin.userdb.panel" className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">User Database</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage registered Aflino users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: registeredUsers.length },
          {
            label: "Active",
            value: registeredUsers.filter((u) => !u.isBlocked).length,
          },
          {
            label: "Blocked",
            value: registeredUsers.filter((u) => u.isBlocked).length,
          },
          {
            label: "PWA Users",
            value: registeredUsers.filter((u) => u.deviceType === "PWA").length,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          >
            <p className="text-2xl font-bold" style={{ color: "#1A73E8" }}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {registeredUsers.length === 0 ? (
          <div
            data-ocid="admin.userdb.empty_state"
            className="flex flex-col items-center py-16 text-gray-400"
          >
            <Users size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm font-medium">No registered users yet</p>
            <p className="text-xs mt-1">
              Users will appear here after signing up.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "User ID",
                    "Email",
                    "Last Active",
                    "Searches",
                    "Device",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registeredUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    data-ocid={`admin.userdb.item.${idx + 1}`}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {user.id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 max-w-[160px] truncate">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.totalSearches}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            user.deviceType === "PWA"
                              ? "rgba(26,115,232,0.1)"
                              : "#f3f4f6",
                          color:
                            user.deviceType === "PWA" ? "#1A73E8" : "#6b7280",
                        }}
                      >
                        {user.deviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isBlocked ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                          Blocked
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          data-ocid={`admin.userdb.toggle.${idx + 1}`}
                          onClick={() => blockUser(user.id)}
                          title={user.isBlocked ? "Unblock user" : "Block user"}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                          style={{
                            color: user.isBlocked ? "#16a34a" : "#f59e0b",
                          }}
                        >
                          {user.isBlocked ? (
                            <ShieldCheck size={15} />
                          ) : (
                            <ShieldBan size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          data-ocid={`admin.userdb.delete_button.${idx + 1}`}
                          onClick={() => handleDelete(user.id, user.email)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
