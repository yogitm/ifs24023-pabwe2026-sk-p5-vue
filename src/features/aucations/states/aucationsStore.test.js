import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAucationsStore } from "./aucationsStore";
import aucationApi from "../api/aucationApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("aucationsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it("should have correct default state", () => {
    const store = useAucationsStore();
    expect(store.aucations).toEqual([]);
    expect(store.aucation).toBeNull();
    expect(store.isAucation).toBe(false);
    expect(store.isAucationAdd).toBe(false);
    expect(store.isAucationAdded).toBe(false);
    expect(store.isAucationChange).toBe(false);
    expect(store.isAucationChanged).toBe(false);
    expect(store.isAucationChangeCover).toBe(false);
    expect(store.isAucationChangedCover).toBe(false);
    expect(store.isAucationDelete).toBe(false);
    expect(store.isAucationDeleted).toBe(false);
    expect(store.isBidAdd).toBe(false);
    expect(store.isBidAdded).toBe(false);
    expect(store.isBidDelete).toBe(false);
    expect(store.isBidDeleted).toBe(false);
    expect(store.isAucationDeleteAll).toBe(false);
    expect(store.isAucationDeletedAll).toBe(false);
  });

  it("should update state with setters", () => {
    const store = useAucationsStore();
    store.setAucations([{ id: 1 }]);
    expect(store.aucations).toEqual([{ id: 1 }]);

    store.setAucation({ id: 2 });
    expect(store.aucation).toEqual({ id: 2 });

    store.setIsAucation(true);
    expect(store.isAucation).toBe(true);

    store.setIsAucationAdd(true);
    expect(store.isAucationAdd).toBe(true);

    store.setIsAucationAdded(true);
    expect(store.isAucationAdded).toBe(true);

    store.setIsAucationChange(true);
    expect(store.isAucationChange).toBe(true);

    store.setIsAucationChanged(true);
    expect(store.isAucationChanged).toBe(true);

    store.setIsAucationChangeCover(true);
    expect(store.isAucationChangeCover).toBe(true);

    store.setIsAucationChangedCover(true);
    expect(store.isAucationChangedCover).toBe(true);

    store.setIsAucationDelete(true);
    expect(store.isAucationDelete).toBe(true);

    store.setIsAucationDeleted(true);
    expect(store.isAucationDeleted).toBe(true);

    store.setIsBidAdd(true);
    expect(store.isBidAdd).toBe(true);

    store.setIsBidAdded(true);
    expect(store.isBidAdded).toBe(true);

    store.setIsBidDelete(true);
    expect(store.isBidDelete).toBe(true);

    store.setIsBidDeleted(true);
    expect(store.isBidDeleted).toBe(true);

    store.setIsAucationDeleteAll(true);
    expect(store.isAucationDeleteAll).toBe(true);

    store.setIsAucationDeletedAll(true);
    expect(store.isAucationDeletedAll).toBe(true);
  });

  describe("asyncSetAucations", () => {
    it("should set aucations on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "getAucations").mockResolvedValue([{ id: 1 }]);

      await store.asyncSetAucations(true, false);

      expect(store.aucations).toEqual([{ id: 1 }]);
      expect(store.isAucation).toBe(true);
    });

    it("should handle error by resetting list", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "getAucations").mockRejectedValue(new Error("Fail"));

      await store.asyncSetAucations();

      expect(store.aucations).toEqual([]);
      expect(store.isAucation).toBe(true);
    });
  });

  describe("asyncSetAucationById", () => {
    it("should set single aucation on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "getAucationById").mockResolvedValue({ id: 5 });

      await store.asyncSetAucationById(5);

      expect(store.aucation).toEqual({ id: 5 });
      expect(store.isAucation).toBe(true);
    });

    it("should handle error by setting null", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "getAucationById").mockRejectedValue(new Error("Fail"));

      await store.asyncSetAucationById(99);

      expect(store.aucation).toBeNull();
      expect(store.isAucation).toBe(true);
    });
  });

  describe("asyncPostAucation", () => {
    it("should add auction and set flags on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postAucation").mockResolvedValue({ id: 10 });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPostAucation("Item", "Desc", 1000, "2026-12-31");

      expect(successSpy).toHaveBeenCalledWith("Sesi lelang berhasil ditambahkan!");
      expect(store.isAucationAdd).toBe(true);
      expect(store.isAucationAdded).toBe(true);
    });

    it("should handle failure on adding auction", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postAucation").mockRejectedValue(new Error("Invalid"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncPostAucation("Item", "Desc", 1000, "2026-12-31");

      expect(errorSpy).toHaveBeenCalledWith("Invalid");
      expect(store.isAucationAdd).toBe(false);
      expect(store.isAucationAdded).toBe(false);
    });
  });

  describe("asyncPutAucation", () => {
    it("should update auction and reload detail on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "putAucation").mockResolvedValue("Berhasil update");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPutAucation(1, "Item", "Desc", 2000, "2026-12-31");

      expect(successSpy).toHaveBeenCalledWith("Berhasil update");
      expect(store.isAucationChange).toBe(true);
      expect(store.isAucationChanged).toBe(true);
    });

    it("should fallback message when putAucation returns empty string", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "putAucation").mockResolvedValue("");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPutAucation(1, "Item", "Desc", 2000, "2026-12-31");

      expect(successSpy).toHaveBeenCalledWith("Data lelang berhasil diperbarui!");
      expect(store.isAucationChange).toBe(true);
    });

    it("should handle failure on updating auction", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "putAucation").mockRejectedValue(new Error("Failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncPutAucation(1, "Item", "Desc", 2000, "2026-12-31");

      expect(errorSpy).toHaveBeenCalledWith("Failed");
      expect(store.isAucationChange).toBe(false);
    });
  });

  describe("asyncPostAucationCover", () => {
    it("should upload cover and reload detail on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postAucationCover").mockResolvedValue("Berhasil cover");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPostAucationCover(1, new File([""], "c.jpg"));

      expect(successSpy).toHaveBeenCalledWith("Berhasil cover");
      expect(store.isAucationChangeCover).toBe(true);
      expect(store.isAucationChangedCover).toBe(true);
    });

    it("should fallback message when postAucationCover returns empty string", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postAucationCover").mockResolvedValue("");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPostAucationCover(1, new File([""], "c.jpg"));

      expect(successSpy).toHaveBeenCalledWith("Cover lelang berhasil diperbarui!");
      expect(store.isAucationChangeCover).toBe(true);
    });

    it("should handle error on cover upload", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postAucationCover").mockRejectedValue(new Error("Format salah"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncPostAucationCover(1, new File([""], "c.jpg"));

      expect(errorSpy).toHaveBeenCalledWith("Format salah");
      expect(store.isAucationChangeCover).toBe(false);
    });
  });

  describe("asyncDeleteAucation", () => {
    it("should delete auction and set flags on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteAucation").mockResolvedValue("Dihapus");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncDeleteAucation(1);

      expect(successSpy).toHaveBeenCalledWith("Dihapus");
      expect(store.isAucationDelete).toBe(true);
      expect(store.isAucationDeleted).toBe(true);
    });

    it("should fallback message when delete returns empty string", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteAucation").mockResolvedValue("");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncDeleteAucation(1);

      expect(successSpy).toHaveBeenCalledWith("Lelang berhasil dihapus!");
      expect(store.isAucationDelete).toBe(true);
    });

    it("should handle error on delete", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteAucation").mockRejectedValue(new Error("Gagal hapus"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncDeleteAucation(1);

      expect(errorSpy).toHaveBeenCalledWith("Gagal hapus");
      expect(store.isAucationDelete).toBe(false);
    });
  });

  describe("asyncPostBid", () => {
    it("should post bid and reload detail on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postBid").mockResolvedValue("Bid ok");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPostBid(1, 100000);

      expect(successSpy).toHaveBeenCalledWith("Bid ok");
      expect(store.isBidAdd).toBe(true);
      expect(store.isBidAdded).toBe(true);
    });

    it("should fallback message when postBid returns empty string", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postBid").mockResolvedValue("");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPostBid(1, 100000);

      expect(successSpy).toHaveBeenCalledWith("Penawaran berhasil diajukan!");
      expect(store.isBidAdd).toBe(true);
    });

    it("should handle error on post bid", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "postBid").mockRejectedValue(new Error("Bid terlalu rendah"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncPostBid(1, 100000);

      expect(errorSpy).toHaveBeenCalledWith("Bid terlalu rendah");
      expect(store.isBidAdd).toBe(false);
    });
  });

  describe("asyncDeleteBid", () => {
    it("should cancel bid and reload detail on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteBid").mockResolvedValue("Bid dibatalkan");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncDeleteBid(1);

      expect(successSpy).toHaveBeenCalledWith("Bid dibatalkan");
      expect(store.isBidDelete).toBe(true);
      expect(store.isBidDeleted).toBe(true);
    });

    it("should fallback message when deleteBid returns empty string", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteBid").mockResolvedValue("");
      vi.spyOn(store, "asyncSetAucationById").mockResolvedValue();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncDeleteBid(1);

      expect(successSpy).toHaveBeenCalledWith("Penawaran berhasil dibatalkan!");
      expect(store.isBidDelete).toBe(true);
    });

    it("should handle error on delete bid", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteBid").mockRejectedValue(new Error("Tidak ada bid"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncDeleteBid(1);

      expect(errorSpy).toHaveBeenCalledWith("Tidak ada bid");
      expect(store.isBidDelete).toBe(false);
    });
  });

  describe("asyncDeleteAllAucations", () => {
    it("should delete all auctions and reset state on success", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteAucations").mockResolvedValue("Semua dihapus");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncDeleteAllAucations();

      expect(successSpy).toHaveBeenCalledWith("Semua dihapus");
      expect(store.isAucationDeleteAll).toBe(true);
      expect(store.isAucationDeletedAll).toBe(true);
      expect(store.aucations).toEqual([]);
    });

    it("should fallback message when deleteAucations returns empty string", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteAucations").mockResolvedValue("");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncDeleteAllAucations();

      expect(successSpy).toHaveBeenCalledWith("Semua data lelang berhasil dihapus!");
      expect(store.isAucationDeleteAll).toBe(true);
    });

    it("should handle error on delete all auctions", async () => {
      const store = useAucationsStore();
      vi.spyOn(aucationApi, "deleteAucations").mockRejectedValue(new Error("Gagal"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncDeleteAllAucations();

      expect(errorSpy).toHaveBeenCalledWith("Gagal");
      expect(store.isAucationDeleteAll).toBe(false);
    });
  });
});
