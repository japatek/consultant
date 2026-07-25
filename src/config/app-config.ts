import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "JaPa Platform",
  version: packageJson.version,
  copyright: `© ${currentYear}, JaPaTek Platform`,
  meta: {
    title: "JaPaTek Platform - Modern AI Chatbot Web App",
    description:
      "JaPaTek is a modern artificial intellegence models and platform delivered by PT. JAPA TEKNIKA SOLUSI. It functions as a conversational assistant, an enterprise productivity tool, and a developer platform for building autonomous AI agents.",
  },
};
