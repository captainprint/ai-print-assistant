type StatusBadgeProps = {
  status: "New" | "Open" | "Resolved";
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles = {
    New: "bg-blue-100 text-blue-700",
    Open: "bg-green-100 text-green-700",
    Resolved: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}