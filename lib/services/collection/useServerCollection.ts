import { collectionService, CreateCollectionInput } from "./api";

export async function getCollections() {
  try {
    const collections = await collectionService.findAll();
    return { data: collections, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getCollectionBySlug(slug: string) {
  try {
    const collection = await collectionService.findOne(slug);
    return { data: collection, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createCollection(data: CreateCollectionInput) {
  try {
    const collection = await collectionService.create(data);
    return { data: collection, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateCollection(id: string, data: Partial<CreateCollectionInput>) {
  try {
    const collection = await collectionService.update(id, data);
    return { data: collection, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function removeCollection(id: string) {
  try {
    const result = await collectionService.remove(id);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
