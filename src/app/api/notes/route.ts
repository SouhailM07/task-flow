import { NextRequest } from "next/server";
import connectMongoose from "@/lib/connectDB";
import Note from "@/models/note.model";
import handleResponse from "@/lib/handleResponse";

connectMongoose();

export async function GET(req: NextRequest) {
  try {
    // const collectionId = req.nextUrl.searchParams.get("collectionId");
    // { noteCollection: collectionId }
    const notes = await Note.find({}).populate("notesCollection");
    // if (!notes) {
    //   return handleResponse("notes was not found", 404);
    // }
    return handleResponse(notes, 200);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const values = await req.json();
    const newNote = new Note(values);
    await newNote.save();
    return handleResponse("new note was created successfully", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const values = await req.json();
    const updatedNote = await Note.findByIdAndUpdate(id, values);
    if (!updatedNote) {
      return handleResponse("note was not found", 404);
    }
    return handleResponse("note was updated successfully", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const deleteNote = await Note.findByIdAndDelete(id);
    if (!deleteNote) {
      return handleResponse("note was not found", 404);
    }
    return handleResponse("note was deleted successfully", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}
