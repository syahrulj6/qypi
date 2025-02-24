import { createNote, createNoteBook } from "~/schemas/notes";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const notesRouter = createTRPCRouter({
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
});
