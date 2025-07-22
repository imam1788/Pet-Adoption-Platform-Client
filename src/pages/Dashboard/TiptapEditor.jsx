import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    return () => editor?.destroy(); // cleanup
  }, [editor]);

  return (
    <div className="border rounded p-2">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
