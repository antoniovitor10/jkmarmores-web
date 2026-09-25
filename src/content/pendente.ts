export type Pendente = Readonly<{ __pendente: true; descricao: string }>;

export function pendente(descricao: string): Pendente {
  return { __pendente: true, descricao };
}

export function isPendente(valor: unknown): valor is Pendente {
  return typeof valor === "object" && valor !== null && "__pendente" in valor && valor.__pendente === true;
}
