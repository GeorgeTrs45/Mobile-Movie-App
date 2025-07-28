import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

//track the searches made by user
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);
    // check if a reacord of that search has already been stored
    //if document is found, increment the search count field
    // if no document is found => create a new document in appwrite database
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log("🚀 ~ getTrendingMovies ~ error:", error);
    return undefined;
  }
};

export const addToSavedMovies = async (id: number, title: string, poster_path: string) => {
  try {
    await database.createDocument(DATABASE_ID, SAVED_COLLECTION_ID, ID.unique(), {
      movie_id: id,
      title,
      poster_url: `https://image.tmdb.org/t/p/w500${poster_path}`,
    });
  } catch (error) {
    console.error("Error adding to saved movies:", error);
    throw error;
  }
};

export const checkSavedMovie = async (id: number): Promise<boolean>=>{
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("movie_id", id),
    ])
    if(result.documents.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking saved movie:", error);
    return false;
  }
}
export const removeFromSavedMovies = async (id: number): Promise<boolean> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("movie_id", id),
    ]);
    if (result.documents.length > 0) {
      await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, result.documents[0].$id);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error removing from saved movies:", error);
    return false;
  }
}
export const getSavedMovies = async ():Promise<SavedMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID);
    if(result.documents.length > 0) {
      return result.documents as unknown as SavedMovie[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return undefined;
  }
}
