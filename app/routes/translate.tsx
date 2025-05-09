import type { Route } from "./+types/translate";
import { TranslateForm } from "../translate/form";
import Content from "view/components/Content";
import Sidepane from "view/components/Sidepane";
import { useActionData } from "react-router";
import type { ActionFunction } from "react-router";
import type { Translation } from "domain/types/Translation";
import { useState, useEffect, use } from "react";
import { createCachedFunTranslationService } from "io/service/CacheService";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const text = formData.get("text");
  const engine = formData.get("engine");

  if (typeof text !== "string" || typeof engine !== "string") {
    return { error: "Invalid input" };
  }

  const translationService = createCachedFunTranslationService();
  const translation = await translationService.getTranslation(text, engine);

  return translation;
};

export default function Translate() {

  const newTranslation = useActionData();
  const [history, setHistory] = useState<Translation[]>([]);

  useEffect(() => {
    const storedHistory: string | null = typeof window !== "undefined" ? localStorage.getItem("translation-history") : null;
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Update history when new translation is received
  useEffect(() => {
    if (newTranslation) {
      setHistory((prev) => {
        const updated = [...prev, newTranslation];
        localStorage.setItem("translation-history", JSON.stringify(updated));
        return updated;
      });
    }
  }, [newTranslation]);

  return (
    <div className="flex h-full py-3">
      <Sidepane>
      <h2 className="font-bold text-lg mb-4">Past Translations</h2>
        <ul className="space-y-4">
          {history.map((item: Translation, idx: number) => (
            <li key={idx} className="bg-white p-3 rounded shadow">
              <p className="text-gray-700">{item.translated}</p>
              <p className="text-xs text-gray-400 mt-1 italic">
                Original text: {item.text}
              </p>
              <p className="text-xs text-gray-400 mt-1 italic">
                Engine: {item.translation || "Unknown"}
              </p>
            </li>
          ))}
        </ul>
        {history.length > 0 && 
          <button
            onClick={() => {
              setHistory([]);
              localStorage.removeItem("translation-history");
            }}
            className="mt-4 text-sm text-red-500 hover:underline"
          >
            Clear History
          </button>}
      </Sidepane>
      <Content>
        <TranslateForm />
        {newTranslation && (
          <div className="mt-8 p-4 border rounded-xl shadow">
            <h2 className="text-gray-700 text-lg font-semibold">Text:</h2>
            <p className="text-gray-700 mb-2">{newTranslation.text}</p>
            <h2 className="text-gray-700 text-lg font-semibold ">Translation:</h2>
            <p className="text-gray-700 mb-2">{newTranslation.translated}</p>
            <h2 className="text-gray-700 text-lg font-semibold">Engine:</h2>
            <p className="text-gray-700 mb-2">{newTranslation.translation || "Unknown"}</p>
          </div>
        )}
      </Content>
    </div>
  );
}


