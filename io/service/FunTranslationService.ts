import type { Translation } from "domain/types/Translation";
import YodaTranslationRepo from "../repo/YodaTranslationRepo";

interface FunTranslationService {
  getTranslation(text: string, engine: string): Promise<Translation>;
}

class DefaultFunTranslationService implements FunTranslationService {
  repo: YodaTranslationRepo;

  constructor(repo: YodaTranslationRepo) {
    this.repo = repo;
  }

  async getTranslation(text: string, engine: string) {
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

    return translations
  }
}

const createDefaultFunTranslationService = () => {
  const yodaRepo = new YodaTranslationRepo();
  const service = new DefaultFunTranslationService(yodaRepo);

  return service;
};

export { DefaultFunTranslationService, createDefaultFunTranslationService };
