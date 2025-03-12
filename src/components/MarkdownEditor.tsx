'use client'

import { useEffect, useState, useRef } from "react";

import {useEditor, EditorContent, JSONContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";

import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "notes"

type Note = {
    id: string;
    title: string;
    content: JSONContent;
};

const MarkdownEditor = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const activeNoteIdRef = useRef<string | null>(null);
    const isLoadingNote = useRef(false);

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose focus:outline-none',
            },
        },
        parseOptions: { preserveWhitespace: 'full' },
        immediatelyRender: false,
    })

    // Load notes from LoacalStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsedNotes = JSON.parse(saved);
            setNotes(parsedNotes);
            if (parsedNotes.length > 0) {
                setActiveNoteId(parsedNotes[0].id);
            }
        }

    }, []);

    useEffect(() => {
        activeNoteIdRef.current = activeNoteId;
    }, [activeNoteId]);

    // When the acitve note changes, show it in the editor
    useEffect(() => {
        if (editor && activeNoteId) {
            const activeNote = notes.find(note => note.id === activeNoteId);
            if (activeNote) {
                isLoadingNote.current = true;
                editor.commands.setContent(activeNote.content || {type: "doc", content: [{ type: "paragraph" }]});
                setTimeout(() => {
                    isLoadingNote.current = false;
                }, 100);
            }
        }
    }, [activeNoteId, editor, notes]);

    // Autosave to LocalStorage when content is changed
    useEffect(() => {
        if (editor) {
            editor.on('update', ({ editor }) => {
                if (isLoadingNote.current) return;

                const updatedContent = editor.getJSON();
                const currentNoteId = activeNoteIdRef.current;

                setNotes(prevNotes => {
                    const updateNotes = prevNotes.map(note =>
                        note.id === currentNoteId
                            ? { ...note, content: updatedContent }
                            : note
                    );
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updateNotes));
                    return updateNotes;
                });
            });
        }
    }, [editor]);

    const addNewNote = () => {
        const newNote: Note = {
            id: uuidv4(),
            title: "Ny Anteckning " + (notes.length + 1),
            content: {type: "doc", content: [{ type: "paragraph" }]},
        };
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        setActiveNoteId(newNote.id);
    };

    if (!editor) {
        return null
    }

    return (
        <div className="flex h-screen">
            {/* Sidemenu */}
            <aside className="w-64 bg-white shadow-md p-4 space-y-2 overflow-y-auto">
                <button
                    onClick={addNewNote}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                >
                    + Ny Anteckning
                </button>
                {notes.map(note => (
                    <div
                        key={note.id}
                        onClick={() => setActiveNoteId(note.id)}
                        className={`p-2 rounded cursor-pointer ${
                            note.id === activeNoteId ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                    >
                        {note.title}
                    </div>
                ))}
            </aside>

            {/* Editor */}
            <main className="flex-1 p-4 overflow-y-auto">
                {editor && notes.length > 0 ? (
                    <>
                        <ToolBar editor={editor} />
                        <EditorContent editor={editor} />
                    </>
                ) : (
                    <p className="text-gray-500">Välj en anteckning eller skapa en ny för att börja skriva.</p>
                )}
            </main>
        </div>
    )
}

const ToolBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 pb-4 bg-gray-100 border-b-2 border-gray-200">
            {/* Undo and redo buttons */}
            <div className="grid grid-cols-2 bg-gray-200 rounded divide-x-1 divide-gray-300">
                {/* Undo */}
                <button
                    className="px-2 py-1 rounded-l hover:enabled:bg-gray-300 enabled:shadow-xs enabled:shadow-gray-400 focus:enabled:shadow-inner disabled:text-gray-400"
                    onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}
                >
                    <GrUndo size={20} />
                </button>

                {/* Redo */}
                <button
                    className="px-2 py-1 rounded-r hover:enabled:bg-gray-300 enabled:shadow-xs enabled:shadow-gray-400 focus:enabled:shadow-inner disabled:text-gray-400"
                    onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}
                >
                    <GrRedo size={20} />
                </button>
            </div>

            {/* Bold */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('bold') ? 'shadow-inner' : 'shadow-xs'}`}
            >
                <b>B</b>
            </button>

            {/* Italic */}
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('italic') ? 'shadow-inner' : 'shadow-xs'}`}
            >
                <i>i</i>
            </button>

            {/* Underline */}
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('underline') ? 'shadow-inner' : 'shadow-xs'}`}
            >
                <u>U</u>
            </button>

            {/* Heading */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('heading', { level: 1 }) ? 'shadow-inner' : 'shadow-xs'}`}
            >
                H1
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('heading', { level: 2 }) ? 'shadow-inner' : 'shadow-xs'}`}
            >
                H2
            </button>

            {/* Bullet List */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('bulletList') ? 'shadow-inner' : 'shadow-xs'}`}
            >
                • Lista
            </button>

            {/* Numbered List */}
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('orderedList') ? 'shadow-inner' : 'shadow-xs'}`}
            >
                1. Lista
            </button>

            {/* Blockquote */}
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 ${editor.isActive('blockquote') ? 'shadow-inner' : 'shadow-xs'}`}
            >
                “ Citat
            </button>

            {/* Divider */}
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={`px-2 py-1 rounded bg-gray-200 shadow-gray-400 hover:bg-gray-300 shadow-xs focus:shadow-inner`}
            >
                ―
            </button>
        </div>
    )
}

export default MarkdownEditor;