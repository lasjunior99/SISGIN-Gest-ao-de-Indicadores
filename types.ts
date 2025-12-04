export type Status = 'draft' | 'final';

export interface Manager {
  id: string;
  nome: string;
}

export interface Perspective {
  id: string;
  nome: string;
}

export interface Objective {
  id: string;
  perspectivaId: string;
  nome: string;
  gestorId: string;
}

export interface Indicator {
  id: string;
  perspectivaId: string;
  objetivoId: string;
  gestorId: string;
  indicador: string;
  descricao: string;
  formula: string;
  unidade: string;
  fonte: string;
  periodicidade: string;
  polaridade: string;
  status: Status;
  updatedAt: string;
}

export interface MetaFaixas {
  azulDe: string;
  azulAte: string;
  verdeDe: string;
  verdeAte: string;
  amareloDe: string;
  amareloAte: string;
  vermelhoAbaixoDe: string;
}

export interface MetaMensal {
  jan: string;
  fev: string;
  mar: string;
  abr: string;
  mai: string;
  jun: string;
  jul: string;
  ago: string;
  set: string;
  out: string;
  nov: string;
  dez: string;
}

export interface Meta {
  id: string;
  indicadorId: string;
  ano: number | null;
  tipoCalculo: string;
  metas: MetaMensal;
  faixas: MetaFaixas;
  ref1: string;
  ref2: string;
  ref3: string;
  status: Status;
  updatedAt: string;
}

export interface AppData {
  adminPassword: string;
  perspectives: Perspective[];
  objectives: Objective[];
  managers: Manager[];
  indicators: Indicator[];
  metas: Meta[];
}
