'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";

const Tiptap = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                class: 'prose focus:outline-none',
            },
        },
        content: '<p>Hello World! 🌎️</p>',
    })

    if (!editor) {
        return null
    }

    return (
        <>
            <div className="flex">
                <div className="grid grid-cols-2 bg-gray-200 rounded-xl divide-x-1 divide-gray-300">
                    <button
                        className="disabled:text-gray-400 px-2 py-1 rounded-l-xl hover:enabled:bg-gray-300"
                        onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}
                    >
                        <GrUndo size={20} />
                    </button>
                    <button
                        className="disabled:text-gray-400 px-2 py-1 rounded-r-xl hover:enabled:bg-gray-300"
                        onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}
                    >
                        <GrRedo size={20} />
                    </button>
                </div>
            </div>

            <EditorContent editor={editor} />
        </>
    )
}

export default Tiptap