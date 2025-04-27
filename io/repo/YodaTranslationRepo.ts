class YodaTranslationRepo {
  async getTranslation(text: string, engine: string) {
    const response = await fetch(
      `https://api.funtranslations.com/translate/${engine}.json`,
      { 
        method: "POST",  
        headers: {
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ text }) }
    );
    if (!response.ok) {
      return Promise.resolve({
        json() {
          return {error: `Something went wrong: ${response.statusText}`};
        },
      });
    }
    
    const json = await response.json();

    return Promise.resolve({
      json() {
        return json;
      },
    });
  }
}

export default YodaTranslationRepo;
