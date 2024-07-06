import { Link } from "react-router-dom";

export default function Card({
  id,
  username,
  title,
  firstline,
}: {
  id: number;
  username: string;
  title: string;
  firstline: string;
}) {
  return (
    <>
      <div>
        <Link to={"/view/" + id}>
          <div className=" flex flex-col max-w-sm p-4 shadow-md border-2 border-sky-500 rounded-md">
            <p className=" font-bold text-xl text-zinc-700">{title}</p>
            <p className=" text-sm text-zinc-700">{username}</p>
            <p className=" text-sm text-zinc-600 truncate">{firstline}</p>
          </div>
        </Link>
      </div>
    </>
  );
}
