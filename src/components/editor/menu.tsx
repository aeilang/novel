import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading,
  Redo2,
  Undo2,
} from "lucide-react";

export const Menu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "text-black" : ""}
      >
        <BoldIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? "text-red-500" : ""
        }
      >
        <Heading />
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={
          !editor.can().chain().focus().undo().run()
            ? " cursor-not-allowed"
            : ""
        }
      >
        <Undo2 />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={
          !editor.can().chain().focus().undo().run()
            ? " cursor-not-allowed"
            : ""
        }
      >
        <Redo2 />
      </button>
    </>
  );
};
