import { Link } from "react-router-dom";


export default function QuickLinkCard({
  title,
  description,
  path,
}) {
  return (
    <Link
      to={path}
      className="card p-5 hover:shadow-lg transition block"
    >

      <h3 className="text-lg font-semibold text-slate-700">
        {title}
      </h3>


      <p className="text-sm text-slate-500 mt-2">
        {description}
      </p>


    </Link>
  );
}