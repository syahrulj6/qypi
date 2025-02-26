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
        include: { notebook: true },
      }),
    ]);

    const combinedData = [
      ...notebooks.map((notebook) => ({
        id: notebook.id,
        title: notebook.title,
        type: "folder" as const,
        color: notebook.color,
        createdAt: notebook.createdAt,
        updatedAt: notebook.updatedAt,
        notesCount: notebook.notes.length,
      })),
      ...notes.map((note) => ({
        id: note.id,
        title: note.title,
        type: "file" as const, // 👈 Explicitly define the type
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

  getNoteOrFolder: privateProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const { db } = ctx;
      const { slug } = input;

      const folder = await db.notebook.findUnique({
        where: { id: slug },
        include: { notes: true },
      });

      if (folder) {
        return { type: "folder", folder };
      }

      const note = await db.note.findUnique({
        where: { id: slug },
      });

      if (note) {
        return { type: "file", note };
      }

      throw new Error("Not Found");
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
        notesId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { notesId } = input;

      const childNode = await db.note.findMany({
        where: {
          notebookId: notesId,
        },
      });

      if (childNode !== null) {
        await db.note.deleteMany({
          where: {
            notebookId: notesId,
          },
        });
      }

      const deleteNotes = await db.notebook.delete({
        where: {
          id: notesId,
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
});
