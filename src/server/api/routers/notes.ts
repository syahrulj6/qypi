import { createNote, createNoteBook } from "~/schemas/notes";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const notesRouter = createTRPCRouter({
  getNoteById: privateProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { noteId } = input;

      const getNote = await db.note.findUnique({
        where: {
          id: noteId,
        },
      });
      return getNote;
    }),

  getNotebookById: privateProcedure
    .input(
      z.object({
        notebookId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { notebookId } = input;

      const getNotebook = await db.notebook.findUnique({
        where: {
          id: notebookId,
        },
      });

      return getNotebook;
    }),

  getAllNoteBooks: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    if (!user) throw new Error("Unauthorized!");

    const notebooks = await db.notebook.findMany({
      include: {
        notes: true,
      },
    });

    return notebooks;
  }),

  getAllNotes: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    if (!user) throw new Error("Unauthorized");

    const notes = await db.note.findMany({
      include: {
        notebook: true,
      },
    });

    return notes;
  }),

  getAllNotesAndNotebooks: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    if (!user) throw new Error("Unauthorized!");

    const [notebooks, notes] = await Promise.all([
      db.notebook.findMany({
        include: { notes: true },
      }),
      db.note.findMany({
        where: { notebookId: null },
        include: { notebook: true },
      }),
    ]);

    const combinedData = [
      ...notebooks.map((notebook) => ({
        id: notebook.id,
        title: notebook.title,
        type: "notebook" as const,
        color: notebook.color,
        createdAt: notebook.createdAt,
        updatedAt: notebook.updatedAt,
        notesCount: notebook.notes.length,
      })),
      ...notes.map((note) => ({
        id: note.id,
        title: note.title,
        type: "note" as const, // 👈 Explicitly define the type
        content: note.content,
        notebookId: note.notebookId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })),
    ];

    combinedData.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return combinedData;
  }),

  getNoteOrNotebookById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const notebook = await db.notebook.findUnique({
        where: { id },
        include: { notes: true },
      });

      if (notebook) {
        return {
          ...notebook,
          type: "notebook" as const,
        };
      }

      const note = await db.note.findUnique({
        where: { id },
      });

      if (note) {
        return {
          ...note,
          type: "note" as const,
        };
      }

      return null;
    }),

  createNoteBook: privateProcedure
    .input(createNoteBook)
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;
      const { title, color } = input;

      if (!user) throw new Error("Unauthorized!");

      const createNoteBook = await db.notebook.create({
        data: {
          title: title,
          color: color,
          ownerId: user.id,
        },
      });

      return createNoteBook;
    }),

  createNote: privateProcedure
    .input(createNote)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { notebookId, title, content } = input;

      if (!user) throw new Error("Unauthorized");

      if (notebookId) {
        const notebook = await db.notebook.findUnique({
          where: { id: notebookId, ownerId: user.id },
        });

        if (!notebook) throw new Error("Notebook not found!");
      }

      const createNote = await db.note.create({
        data: {
          title,
          content,
          notebookId: notebookId || null,
        },
      });

      return createNote;
    }),

  deleteNoteById: privateProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { noteId } = input;

      const deleteNote = await db.note.delete({
        where: {
          id: noteId,
        },
      });

      return deleteNote;
    }),

  deleteNotesById: privateProcedure
    .input(
      z.object({
        notebookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { notebookId } = input;

      const childNode = await db.note.findMany({
        where: {
          notebookId: notebookId,
        },
      });

      if (childNode !== null) {
        await db.note.deleteMany({
          where: {
            notebookId: notebookId,
          },
        });
      }

      const deleteNotes = await db.notebook.delete({
        where: {
          id: notebookId,
        },
      });

      return deleteNotes;
    }),

  editNote: privateProcedure
    .input(
      z.object({
        noteId: z.string(),
        title: z.string().min(1, "Title is required"),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { title, content, noteId } = input;

      const editNote = await db.note.update({
        where: {
          id: noteId,
        },
        data: {
          title,
          content,
        },
      });

      return editNote;
    }),

  editNotebook: privateProcedure
    .input(
      z.object({
        notebookId: z.string(),
        title: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { notebookId, title, color } = input;

      const editNotebook = await db.notebook.update({
        where: {
          id: notebookId,
        },
        data: {
          title,
          color,
        },
      });

      return editNotebook;
    }),
});
