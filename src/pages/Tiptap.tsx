import { BubbleMenu, Editor, EditorContent, useEditor } from "@tiptap/react";

import CharacterCount from "@tiptap/extension-character-count";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Menu } from "@/components/editor/menu";
import { useState } from "react";
import { FileJson, Send, ToggleLeft, ToggleRight } from "lucide-react";
import Theme from "@/components/theme/theme";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";

export default function Tiptap() {
  const [open, setOpen] = useState(true);

  const [content] = useState(() => {
    const content = localStorage.getItem("novel");
    if (!content) {
      return "<h3></h3>";
    }

    return JSON.parse(content);
  });

  const props = {
    attributes: {
      class: `prose prose-gray mt-12 prose-h3:text-center max-w-none xl:prose-xl 2xl:prose-2xl sm:prose-sm w-full prose-p:indent-8 md:prose-lg dark:prose-invert focus:outline-none min-h-screen p-8 mx-auto shadow-lg cursor-text font-mono`,
    },
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      TextAlign.configure({
        alignments: ["left", "right", "center"],
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "小说标题",
      }),
    ],
    content: content,
    editorProps: props,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      localStorage.setItem("novel", JSON.stringify(json));
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (content: string) => {
      return api
        .post("/novel", {
          content: content,
        })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      navigate("/view/" + data?.id);
    },
  });

  const handleSend = (editor: Editor) => {
    const content = editor.getHTML();
    mutation.mutate(content);
  };

  return (
    <>
      <div className="">
        <div className="mx-auto w-full sm:w-2/3 lg:w-1/2 relative">
          <BubbleMenu
            tippyOptions={{ duration: 50 }}
            editor={editor}
            className=" p-1 shadow-sm flex flex-row space-x-1 bg-zinc-400 text-white"
          >
            {editor && <Menu editor={editor} />}
          </BubbleMenu>

          <div className="sticky flex w-full top-0 justify-center border-b">
            {open && (
              <div className="flex justify-around w-full">
                {editor && <Menu editor={editor} />}
              </div>
            )}
          </div>

          <EditorContent editor={editor} />

          <div className="fixed bottom-0 right-1/4 flex space-x-5">
            <button
              className=""
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            >
              {open ? <ToggleRight /> : <ToggleLeft />}
            </button>
            <Theme />
            {editor && (
              <button
                onClick={() => {
                  const content = editor.getHTML();
                  console.log(content);
                }}
              >
                <FileJson />
              </button>
            )}

            {editor && (
              <button onClick={() => handleSend(editor)}>
                <Send />
              </button>
            )}
          </div>

          <div className="fixed bottom-1 right-auto text-sm text-zinc-500 dark:text-white">
            {editor && editor?.storage.characterCount.characters()} 个字
          </div>
        </div>
      </div>
    </>
  );
}
