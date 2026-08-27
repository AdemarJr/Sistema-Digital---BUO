import { useCallback, useState } from "react";
import { BUO } from "../types/buo";
import * as storage from "../services/localStorageService";

export {
  newPessoa,
  newObjeto,
  newIntegrante,
} from "../services/localStorageService";

export function useBuoStore() {
  const [buos, setBuos] = useState<BUO[]>(() => storage.getBUOs());

  const refresh = useCallback(() => {
    setBuos(storage.getBUOs());
  }, []);

  const create = (): BUO => {
    const b = storage.createBUO();
    refresh();
    return b;
  };

  const update = (buo: BUO) => {
    storage.saveBUO(buo);
    refresh();
  };

  const get = (id: string) => storage.getBUO(id) ?? buos.find((b) => b.id === id);

  const remove = (id: string) => {
    storage.deleteBUO(id);
    refresh();
  };

  const archive = (id: string) => {
    const buo = storage.getBUO(id);
    if (!buo) return;
    storage.saveBUO({ ...buo, status: "ARQUIVADO" });
    refresh();
  };

  const finalize = (id: string) => {
    storage.finalizeBUO(id);
    refresh();
  };

  const markPdfGerado = (id: string) => {
    storage.markPdfGerado(id);
    refresh();
  };

  const duplicate = (id: string): BUO | null => {
    const dup = storage.duplicateBUO(id);
    refresh();
    return dup;
  };

  const exportData = () => {
    storage.downloadBackup();
  };

  const importData = async (file: File, mode: "merge" | "replace" = "merge") => {
    const text = await file.text();
    const result = storage.importBackup(text, mode);
    refresh();
    return result;
  };

  return {
    buos,
    create,
    update,
    get,
    remove,
    archive,
    finalize,
    markPdfGerado,
    duplicate,
    exportData,
    importData,
    refresh,
  };
}
