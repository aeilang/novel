import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function Viewer() {
  const { novelId } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["view", novelId],
    queryFn: () => {
      if (novelId === undefined) {
        return Promise.reject("empty");
      }
      const data = api.get("/view/" + novelId).then((resp) => resp.data);
      return data;
    },
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div
      className="prose prose-gray mt-12 prose-h3:text-center xl:prose-xl 2xl:prose-2xl prose-sm w-full prose-p:indent-8 md:prose-md dark:prose-invert min-h-screen p-8 mx-auto shadow-lg font-mono"
      dangerouslySetInnerHTML={{ __html: data.content }}
    ></div>
  );
}
