"use server";
import { ID, Models, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return newUser; // <-- Return the created user
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return existingUser?.users[0];
    }
    return null; // Explicitly return null for other errors
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      [
        Query.equal("userId", userId), // <-- fix field name here
      ]
    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

function parseStringify<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const registerPatient = async (input: any) => {
  try {
    let patient: any = {};
    let identificationDocument = undefined;

    // Check if input is FormData (file upload case)
    if (typeof input?.get === "function") {
      // FormData: extract all fields
      patient = {
        email: input.get("email"),
        phone: input.get("phone"),
        userId: input.get("userId"),
        name: input.get("name"),
        privacyConsent:
          input.get("privacyConsent") === "true" ||
          input.get("privacyConsent") === true,
        gender: input.get("gender")
          ? String(input.get("gender")).toLowerCase()
          : undefined,
        birthDate: input.get("birthDate"),
        address: input.get("address"),
        occupation: input.get("occupation"),
        emergencyContactName: input.get("emergencyContactName"),
        emergencyContactNumber: input.get("emergencyContactNumber"),
        insuranceProvider: input.get("insuranceProvider"),
        insurancePolicyNumber: input.get("insurancePolicyNumber"),
        allergies: input.get("allergies"),
        currentMedication: input.get("currentMedication"),
        familyMedicalHistory: input.get("familyMedicalHistory"),
        pastMedicalHistory: input.get("pastMedicalHistory"),
        identificationType: input.get("identificationType"),
        indentificationNumber: input.get("indentificationNumber"), // typo matches your Appwrite schema
        primaryPhysician: input.get("primaryPhysician"),
      };
      identificationDocument = input.get("identificationDocument");
    } else {
      // Plain object
      patient = {
        ...input,
        gender: input.gender ? String(input.gender).toLowerCase() : undefined,
      };
      identificationDocument = input.identificationDocument;
    }

    // Debug: log patient object
    console.log("registerPatient patient object:", patient);

    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument, // may need to convert to buffer if not already
        identificationDocument.name || "document"
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }
    const newPatient = await databases.createDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );
    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};
