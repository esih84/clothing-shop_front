import { collectionService, CreateCollectionInput } from "./api";

export async function useServerCollections() {
  try {
    const collections = await collectionService.findAll();
    return { data: collections, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerCollection(slug: string) {
  try {
    const collection = await collectionService.findOne(slug);
    return { data: collection, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerCreateCollection(data: CreateCollectionInput) {
  try {
    const collection = await collectionService.create(data);
    return { data: collection, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerUpdateCollection(id: string, data: Partial<CreateCollectionInput>) {
  try {
    const collection = await collectionService.update(id, data);
    return { data: collection, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerRemoveCollection(id: string) {
  try {
    const result = await collectionService.remove(id);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
