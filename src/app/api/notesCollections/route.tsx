import { NextRequest } from "next/server";
import handleResponse from "@/lib/handleResponse";
import connectMongoose from "@/lib/connectDB";
import NoteCollection from "@/models/noteCollection";
import Note from "@/models/note.model";

connectMongoose();

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const collectionId = req.nextUrl.searchParams.get("collectionId");
    if (!collectionId) {
      const noteCollections = await NoteCollection.find({
        user: userId,
      }).populate("user");
      return handleResponse(noteCollections, 200);
    }
    const oneNoteCollections = await NoteCollection.findById(collectionId);
    return handleResponse(oneNoteCollections, 200);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const values = await req.json();
    const newNoteCollection = new NoteCollection(values);
    await newNoteCollection.save();
    return handleResponse(newNoteCollection, 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const values = await req.json();
    const collectionId = req.nextUrl.searchParams.get("collectionId");
    const updatedNoteCollection = await NoteCollection.findByIdAndUpdate(
      collectionId,
      values
    );
    if (!updatedNoteCollection) {
      return handleResponse("note collection was not found", 404);
    }
    return handleResponse("note collection was updated successfully", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const collectionId = await req.nextUrl.searchParams.get("collectionId");
    const deleteNoteCollection = await NoteCollection.findByIdAndDelete(
      collectionId
    );
    const DELETE_RELATED_NOTES = await Note.deleteMany({
      notesCollection: deleteNoteCollection._id,
    });
    if (!deleteNoteCollection) {
      return handleResponse("note collection was not found", 404);
    }
    return handleResponse("note collection was deleted successfully", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}
