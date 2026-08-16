import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "JaPaTek Platform",
  version: packageJson.version,
  copyright: `© ${currentYear}, JaPaTek Platform`,
  meta: {
    title: "JaPaTek Consulting - Engineering Consluting Services",
    description:
      "JaPaTek is a website showcase delivered by PT. JAPA TEKNIKA SOLUSI. It functions is for project showcase handeled by PT. JAPA TEKNIKA SOLUSI.",
  },
};
