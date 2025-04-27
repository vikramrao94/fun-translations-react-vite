import type { Translation } from "domain/types/Translation";
import YodaTranslationRepo from "../repo/YodaTranslationRepo";

interface FunTranslationService {
  getTranslation(text: string, engine: string): Promise<Translation>;
}

// This class implements a simple caching mechanism for the translation service
// It stores translations in memory to avoid redundant API calls
// It uses a Map to store translations with a key composed of the text and engine

const cache = new Map<string, Translation>();
class CachedFunTranslationService implements FunTranslationService {
  repo: YodaTranslationRepo;
  
  constructor(repo: YodaTranslationRepo) {
    this.repo = repo;
  }

  async getTranslation(text: string, engine: string) {
    const cacheKey = `${text.toLowerCase().replaceAll(" ","_")}:${engine}`;
    if (cache.has(cacheKey)) {
      console.log("Cache hit for:", cacheKey);
      return cache.get(cacheKey) as Translation;
    }

    console.log("Cache miss for:", cacheKey, "- Fetching from API");

    const response = await this.repo.getTranslation(text, engine);
    const payload = await response.json();
    if (!payload?.success) {
      return {
        text: text,
        translated: payload?.error || "Error",
        translation: engine,
      } as Translation;
    }
      
    const { contents } = payload;

    const translations: Translation = contents;
    cache.set(cacheKey, translations);
    return translations;
  }
}

const createCachedFunTranslationService = () => {
  const yodaRepo = new YodaTranslationRepo();
  const service = new CachedFunTranslationService(yodaRepo);

  return service;
};

export { CachedFunTranslationService, createCachedFunTranslationService };
