export default function PrescriptionCard({
  prescription,
  onOpen,
  onDelete,
}) {
  return (
    <div className="card overflow-hidden">

      <img
        src={prescription.imageUrl}
        alt={prescription.title}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => onOpen(prescription)}
      />

      <div className="p-4">

        <h3 className="font-semibold">
          {prescription.title}
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          {new Date(prescription.createdAt).toLocaleDateString()}
        </p>

        <button
          onClick={() => onDelete(prescription._id)}
          className="mt-4 text-red-600 hover:text-red-700 border border-red-400 hover:border-red-700 px-3 py-1 rounded transition"
        >
          Delete
        </button>

      </div>

    </div>
  );
}