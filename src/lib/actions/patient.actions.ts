"use server";

import { ID, Query } from "node-appwrite";
import { databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

//Create Appwrite User
export const createUser = async (user: CreateUserParams) => {
	try {
		const newUser = await users.create(
			//Correct order to pass the parameters
			ID.unique(),
			user.email,
			user.phone,
			undefined,
			user.name
		);
		return parseStringify(newUser);
	} catch (error: any) {
		//Check existing user
		if (error && error?.code === 409) {
			const documents = await users.list([Query.equal("email", [user.email])]);
			return documents?.users[0];
		}
	}
};

//Get User
export const getUser = async (userId: string) => {
	try {
		const user = await users.get(userId);

		return parseStringify(user);
	} catch (error) {
		console.log(error);
	}
};

//Register User
export const registerPatient = async ({
	identificationDocument,
	...patient
}: RegisterUserParams) => {
	try {
		let file;
		if (identificationDocument) {
			const inputFile =
				identificationDocument &&
				InputFile.fromBuffer(
					identificationDocument?.get("blobFile") as Blob,
					identificationDocument?.get("fileName") as string
				);
			file = await storage.createFile(
				process.env.NEXT_PUBLIC_BUCKET_ID!,
				ID.unique(),
				inputFile
			);
			console.log({ gender: patient.gender });

			const newPatient = await databases.createDocument(
				process.env.DATABASE_ID!,
				process.env.PATIENT_COLLECTION_ID!,
				ID.unique(),
				{
					identificationDocumentId: file?.$id || null,
					identificationDocumentUrl: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/FILES/${file?.$id}/view?project=${process.env.PROJECT_ID}`,
					...patient,
				}
			);
			return parseStringify(newPatient);
		}
	} catch (error) {
		console.log(error);
	}
};

//Get Patient
export const getPatient = async (userId: string) => {
	try {
		const patients = await databases.listDocuments(
			process.env.DATABASE_ID!,
			process.env.PATIENT_COLLECTION_ID!,
			[Query.equal("userId", userId)]
		);

		return parseStringify(patients.documents[0]);
	} catch (error) {
		console.log(error);
	}
};
