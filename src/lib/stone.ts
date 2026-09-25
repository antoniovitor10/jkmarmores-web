import type { Acabamento, Material } from "@/lib/types";

export type StoneSelection = { materialSlug: string; acabamento: string; ambiente: string };
export type StoneSceneProps = {
  mode: "ambiente" | "chapa";
  materialSlug?: string;
  materials: Material[];
  onSelectionChange: (selection: StoneSelection) => void;
  onQuoteRequest: (selection: StoneSelection) => void;
};
export type StoneOption = { slug: string; nome: string; acabamentos: Acabamento[] };
