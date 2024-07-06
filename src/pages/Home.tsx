import Card from "@/components/home/card";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "1";

  const pageInt = parseInt(page, 10);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["novels", page],
    queryFn: () => {
      return api
        .get("/novels?page=" + page + "&limit=4")
        .then((resp) => resp.data);
    },
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Erorr: {error.message}</p>;
  }

  return (
    <>
      <div className=" flex flex-col justify-between h-full">
        <div className=" grid grid-cols-3 gap-2">
          {data.map((novel) => (
            <Card
              id={novel.id}
              username={novel.username}
              title={novel.title}
              firstline={novel.firstline}
            />
          ))}
        </div>
        <div>
          <Link to={`?page=${pageInt - 1 > 0 ? pageInt - 1 : 1}&limit=4`}>
            上一页
          </Link>
          <Link to={`?page=${pageInt + 1}&limit=4`}>下一页</Link>
        </div>
      </div>
    </>
  );
}
