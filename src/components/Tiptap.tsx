'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";

const Tiptap = () => {
    const editor = useEditor({
        extensions: [StarterKit, Underline],
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
        <div className="w-full max-w-4xl max-auto space-y-4">
            {/* Toolbar */}
                <div className="flex flex-wrap gap-2 p-2 rounded bg-gray-100 shadow">
                    {/* Undo and redo buttons */}
                    <div className="grid grid-cols-2 bg-gray-200 rounded divide-x-1 divide-gray-300">
                        {/* Undo */}
                        <button
                            className="disabled:text-gray-400 px-2 py-1 rounded-l hover:enabled:bg-gray-300"
                            onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}
                        >
                            <GrUndo size={20} />
                        </button>

                        {/* Redo */}
                        <button
                            className="disabled:text-gray-400 px-2 py-1 rounded-r hover:enabled:bg-gray-300"
                            onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}
                        >
                            <GrRedo size={20} />
                        </button>
                    </div>

                    {/* Bold */}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        <b>B</b>
                    </button>

                    {/* Italic */}
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        <i>i</i>
                    </button>

                    {/* Underline */}
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('underline') ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        <u>U</u>
                    </button>

                    {/* Heading */}
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        H1
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        H2
                    </button>

                    {/* Bullet List */}
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        • Lista
                    </button>

                    {/* Numbered List */}
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        1. Lista
                    </button>

                    {/* Blockquote */}
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('blockquote') ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                        “ Citat
                    </button>

                    {/* Divider */}
                    <button
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="px-2 py-1 rounded bg-gray-200"
                    >
                        ―
                    </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap