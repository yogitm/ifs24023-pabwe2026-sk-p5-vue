import { defineStore } from "pinia";
import aucationApi from "../api/aucationApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const useAucationsStore = defineStore("aucations", {
  state: () => ({
    aucations: [],
    aucation: null,
    isAucation: false,
    isAucationAdd: false,
    isAucationAdded: false,
    isAucationChange: false,
    isAucationChanged: false,
    isAucationChangeCover: false,
    isAucationChangedCover: false,
    isAucationDelete: false,
    isAucationDeleted: false,
    isBidAdd: false,
    isBidAdded: false,
    isBidDelete: false,
    isBidDeleted: false,
    isAucationDeleteAll: false,
    isAucationDeletedAll: false,
  }),
  actions: {
    setAucations(aucations) {
      this.aucations = aucations;
    },
    setAucation(aucation) {
      this.aucation = aucation;
    },
    setIsAucation(status) {
      this.isAucation = status;
    },
    setIsAucationAdd(status) {
      this.isAucationAdd = status;
    },
    setIsAucationAdded(status) {
      this.isAucationAdded = status;
    },
    setIsAucationChange(status) {
      this.isAucationChange = status;
    },
    setIsAucationChanged(status) {
      this.isAucationChanged = status;
    },
    setIsAucationChangeCover(status) {
      this.isAucationChangeCover = status;
    },
    setIsAucationChangedCover(status) {
      this.isAucationChangedCover = status;
    },
    setIsAucationDelete(status) {
      this.isAucationDelete = status;
    },
    setIsAucationDeleted(status) {
      this.isAucationDeleted = status;
    },
    setIsBidAdd(status) {
      this.isBidAdd = status;
    },
    setIsBidAdded(status) {
      this.isBidAdded = status;
    },
    setIsBidDelete(status) {
      this.isBidDelete = status;
    },
    setIsBidDeleted(status) {
      this.isBidDeleted = status;
    },
    setIsAucationDeleteAll(status) {
      this.isAucationDeleteAll = status;
    },
    setIsAucationDeletedAll(status) {
      this.isAucationDeletedAll = status;
    },

    async asyncSetAucations(isMe = null, isClosed = null) {
      try {
        const aucations = await aucationApi.getAucations(isMe, isClosed);
        this.setAucations(aucations);
      } catch {
        this.setAucations([]);
      } finally {
        this.setIsAucation(true);
      }
    },

    async asyncSetAucationById(id) {
      try {
        const aucation = await aucationApi.getAucationById(id);
        this.setAucation(aucation);
      } catch {
        this.setAucation(null);
      } finally {
        this.setIsAucation(true);
      }
    },

    async asyncPostAucation(title, description, startBid, closedAt) {
      try {
        await aucationApi.postAucation(title, description, startBid, closedAt);
        showSuccessDialog("Sesi lelang berhasil ditambahkan!");
        this.setIsAucationAdd(true);
        this.setIsAucationAdded(true);
      } catch (error) {
        showErrorDialog(error.message);
        this.setIsAucationAdd(false);
        this.setIsAucationAdded(false);
      }
    },

    async asyncPutAucation(id, title, description, startBid, closedAt) {
      try {
        const message = await aucationApi.putAucation(id, title, description, startBid, closedAt);
        showSuccessDialog(message || "Data lelang berhasil diperbarui!");
        this.setIsAucationChange(true);
        this.setIsAucationChanged(true);
        await this.asyncSetAucationById(id);
      } catch (error) {
        showErrorDialog(error.message);
        this.setIsAucationChange(false);
        this.setIsAucationChanged(false);
      }
    },

    async asyncPostAucationCover(id, coverFile) {
      try {
        const message = await aucationApi.postAucationCover(id, coverFile);
        showSuccessDialog(message || "Cover lelang berhasil diperbarui!");
        this.setIsAucationChangeCover(true);
        this.setIsAucationChangedCover(true);
        await this.asyncSetAucationById(id);
      } catch (error) {
        showErrorDialog(error.message);
        this.setIsAucationChangeCover(false);
        this.setIsAucationChangedCover(false);
      }
    },

    async asyncDeleteAucation(id) {
      try {
        const message = await aucationApi.deleteAucation(id);
        showSuccessDialog(message || "Lelang berhasil dihapus!");
        this.setIsAucationDelete(true);
        this.setIsAucationDeleted(true);
      } catch (error) {
        showErrorDialog(error.message);
        this.setIsAucationDelete(false);
        this.setIsAucationDeleted(false);
      }
    },

    async asyncPostBid(id, bid) {
      try {
        const message = await aucationApi.postBid(id, bid);
        showSuccessDialog(message || "Penawaran berhasil diajukan!");
        this.setIsBidAdd(true);
        this.setIsBidAdded(true);
        await this.asyncSetAucationById(id);
      } catch (error) {
        showErrorDialog(error.message);
        this.setIsBidAdd(false);
        this.setIsBidAdded(false);
      }
    },

    async asyncDeleteBid(id) {
      try {
        const message = await aucationApi.deleteBid(id);
        showSuccessDialog(message || "Penawaran berhasil dibatalkan!");
        this.setIsBidDelete(true);
        this.setIsBidDeleted(true);
        await this.asyncSetAucationById(id);
      } catch (error) {
        showErrorDialog(error.message);
        this.setIsBidDelete(false);
        this.setIsBidDeleted(false);
      }
    },

    async asyncDeleteAllAucations() {
      try {
        const message = await aucationApi.deleteAucations();
        showSuccessDialog(message || "Semua data lelang berhasil dihapus!");
        this.setIsAucationDeleteAll(true);
        this.setIsAucationDeletedAll(true);
        this.setAucations([]);
      } catch (error) {
        showErrorDialog(error.message);
        this.setIsAucationDeleteAll(false);
        this.setIsAucationDeletedAll(false);
      }
    },
  },
});
