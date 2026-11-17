import { useEffect } from "react";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../api";
import type { AbstractResponse } from "../../interfaces/AbstractInterfaces";
import type { ChecklistItem } from "./components/ChecklistModal/indexModel";
import { useChecklistModel, type Checklist } from "./indexModel";

export const useChecklistController = () => {
  const { model, updateModel, getFilteredChecklists } = useChecklistModel();

  const loadChecklists = async () => {
    try {
      updateModel({ isLoading: true, error: null });
      const response = await api.get<AbstractResponse<Checklist[]>>(
        "/checklist"
      );

      if (response.status === 200 && response.data.data) {
        updateModel({
          checklists: response.data.data,
          isLoading: false,
        });
      } else {
        throw new Error("Erro ao carregar checklists");
      }
    } catch (error) {
      updateModel({ error: "Erro ao carregar checklists", isLoading: false });
    }
  };

  useEffect(() => {
    loadChecklists();
  }, []);

  const openChecklistModal = (checklist: Checklist | null) => {
    updateModel({
      selectedChecklist: checklist,
      showModal: true,
    });
  };

  const closeModal = () => {
    updateModel({
      showModal: false,
      selectedChecklist: null,
    });
  };

  const refreshChecklists = async () => {
    await loadChecklists();
  };

  const handleCreateChecklist = async (
    nome: string,
    itens: ChecklistItem[],
    certificacao_id: number,
    descricao?: string
  ) => {
    try {
      if (!nome.trim()) {
        toast.warn("Por favor, informe o nome da checklist.");
        return;
      }

      if (!certificacao_id || certificacao_id <= 0) {
        toast.warn("Selecione uma certificação válida.");
        return;
      }

      const itensChecklistValidos = itens
        .filter((item) => item.descricao.trim() !== "")
        .map((item) => ({
          descricao: item.descricao,
          concluido: item.concluido,
          conclusao: item.concluido ? new Date().toISOString() : "1970-01-01T00:00:00.000Z"
        }));

      if (itensChecklistValidos.length === 0) {
        toast.warn("Adicione ao menos um item válido na checklist.");
        return;
      }

      const checklistDTO = {
        nome,
        descricao,
        certificacao_id: certificacao_id,
        itensChecklist: itensChecklistValidos,
      };

      const response = await api.post<AbstractResponse<Checklist>>(
        "/checklist",
        checklistDTO
      );

      if (response.status === 201 && response.data) {
        toast.success("Checklist criada com sucesso!");
        refreshChecklists(); 
      } else {
        throw new Error(response.statusText || "Erro ao criar checklist");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar checklist."));
    }
  };

  const handleUpdateChecklist = async (
    id: number,
    nome: string,
    itens: Array<{ descricao?: string; descricaoItem?: string; concluido: boolean }>,
    certificacao_id: number,
    descricao?: string
  ) => {
    try {
      const itensChecklistValidos = itens.map((item) => ({
        descricaoItem: item.descricao || item.descricaoItem,
        concluido: item.concluido,
        conclusao: item.concluido ? new Date().toISOString() : "1970-01-01T00:00:00.000Z"
      }));
  
      const checklistDTO = {
        nome,
        descricao,
        certificacao_id: certificacao_id,
        itensChecklist: itensChecklistValidos,
      };
  
      const response = await api.put<AbstractResponse<Checklist>>(
        `/checklist/${id}`,
        checklistDTO
      );
  
      if (response.status === 200) {
        toast.success("Checklist atualizada com sucesso!");
        refreshChecklists();
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao atualizar checklist."));
    }
  };

  const handleDeleteChecklist = async (
    checklistId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await api.delete<AbstractResponse<void>>(`/checklist/${checklistId}`);
      toast.success("Checklist excluída com sucesso!");
      refreshChecklists();
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao excluir checklist."));
    }
  };

  return {
    filteredChecklists: getFilteredChecklists(),
    isLoading: model.isLoading,
    error: model.error,
    showModal: model.showModal,
    selectedChecklist: model.selectedChecklist,
    isSidebarExpanded: model.isSidebarExpanded,
    toggleSidebar: () =>
      updateModel({ isSidebarExpanded: !model.isSidebarExpanded }),

    openChecklistModal,
    closeModal,
    refreshChecklists,
    handleDeleteChecklist,
    handleUpdateChecklist,
    handleCreateChecklist,
  };
};

export type ChecklistController = ReturnType<typeof useChecklistController>;
