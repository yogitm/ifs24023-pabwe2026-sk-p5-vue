import { describe, it, expect, vi, beforeEach } from "vitest";
import aucationApi from "./aucationApi";
import apiHelper from "../../../helpers/apiHelper";

describe("aucationApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getAucations", () => {
    it("should fetch aucations with no filters", async () => {
      const mockList = [{ id: 1, title: "Lelang 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { aucations: mockList },
        }),
      });

      const res = await aucationApi.getAucations();
      expect(res).toEqual(mockList);
    });

    it("should fetch aucations with filters and handle empty data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const res = await aucationApi.getAucations(true, false);
      expect(res).toEqual([]);
    });

    it("should throw error when api status fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses gagal",
        }),
      });

      await expect(aucationApi.getAucations(false, true)).rejects.toThrow("Akses gagal");
    });

    it("should throw fallback error when message is empty", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(aucationApi.getAucations()).rejects.toThrow("Gagal mengambil data lelang");
    });
  });

  describe("getAucationById", () => {
    it("should return single aucation detail", async () => {
      const mockDetail = { id: 2, title: "Laptop Gaming" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { aucation: mockDetail },
        }),
      });

      const res = await aucationApi.getAucationById(2);
      expect(res).toEqual(mockDetail);
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Lelang tidak ditemukan",
        }),
      });

      await expect(aucationApi.getAucationById(99)).rejects.toThrow("Lelang tidak ditemukan");
    });

    it("should throw fallback error on failure when message is empty", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(aucationApi.getAucationById(99)).rejects.toThrow("Gagal mengambil detail lelang");
    });
  });

  describe("postAucation", () => {
    it("should create auction and return data", async () => {
      const mockCreated = { id: 10, title: "New Item" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { aucation: mockCreated },
        }),
      });

      const res = await aucationApi.postAucation("New Item", "Desc", 100000, "2026-12-31 23:59:59");
      expect(res).toEqual(mockCreated);
    });

    it("should return message if data.aucation is not returned", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil membuat lelang",
        }),
      });

      const res = await aucationApi.postAucation("New Item", "Desc", 100000, "2026-12-31 23:59:59");
      expect(res).toBe("Berhasil membuat lelang");
    });

    it("should throw formatted error when validation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Validasi gagal",
          data: {
            title: ["Judul wajib diisi"],
          },
        }),
      });

      await expect(
        aucationApi.postAucation("", "Desc", 100, "2026-12-31")
      ).rejects.toThrow("Validasi gagal: Judul wajib diisi");
    });

    it("should throw fallback error when failure message is empty", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        aucationApi.postAucation("Item", "Desc", 100, "2026-12-31")
      ).rejects.toThrow("Gagal membuat sesi lelang");
    });
  });

  describe("putAucation", () => {
    it("should update auction and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const res = await aucationApi.putAucation(1, "Updated", "Desc", 200000, "2026-12-31 23:59:59");
      expect(res).toBe("Berhasil mengubah data");
    });

    it("should throw formatted error on update validation fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
          data: {
            start_bid: ["Nominal harus lebih besar"],
          },
        }),
      });

      await expect(
        aucationApi.putAucation(1, "Up", "Desc", 0, "2026-12-31")
      ).rejects.toThrow("Data tidak valid: Nominal harus lebih besar");
    });

    it("should throw fallback error on update fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        aucationApi.putAucation(1, "Up", "Desc", 100, "2026-12-31")
      ).rejects.toThrow("Gagal mengubah data lelang");
    });
  });

  describe("postAucationCover", () => {
    it("should upload cover with FormData and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const res = await aucationApi.postAucationCover(1, file);
      expect(res).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      });

      const blob = new Blob(["dummy"], { type: "image/jpeg" });
      const res = await aucationApi.postAucationCover(1, blob);
      expect(res).toBe("Berhasil");
    });

    it("should throw error on cover failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const file = new File([""], "c.png");
      await expect(aucationApi.postAucationCover(1, file)).rejects.toThrow("Format tidak didukung");
    });

    it("should throw fallback error on cover failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const file = new File([""], "c.png");
      await expect(aucationApi.postAucationCover(1, file)).rejects.toThrow("Gagal mengubah cover lelang");
    });
  });

  describe("deleteAucation", () => {
    it("should delete auction and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const res = await aucationApi.deleteAucation(1);
      expect(res).toBe("Berhasil menghapus data");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak ditemukan",
        }),
      });

      await expect(aucationApi.deleteAucation(1)).rejects.toThrow("Data tidak ditemukan");
    });

    it("should throw fallback error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(aucationApi.deleteAucation(1)).rejects.toThrow("Gagal menghapus lelang");
    });
  });

  describe("postBid", () => {
    it("should submit bid and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil memberikan tawaran pada lelang",
        }),
      });

      const res = await aucationApi.postBid(1, 150000);
      expect(res).toBe("Berhasil memberikan tawaran pada lelang");
    });

    it("should throw formatted error when bid too low", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tawaran tidak sah",
          data: {
            bid: ["Tawaran harus lebih tinggi dari penawaran saat ini."],
          },
        }),
      });

      await expect(aucationApi.postBid(1, 50000)).rejects.toThrow(
        "Tawaran tidak sah: Tawaran harus lebih tinggi dari penawaran saat ini."
      );
    });

    it("should throw fallback error on bid fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(aucationApi.postBid(1, 50000)).rejects.toThrow("Gagal mengajukan penawaran");
    });
  });

  describe("deleteBid", () => {
    it("should cancel bid and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus tawaran pada lelang",
        }),
      });

      const res = await aucationApi.deleteBid(1);
      expect(res).toBe("Berhasil menghapus tawaran pada lelang");
    });

    it("should throw error on delete bid fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tawaran tidak ada",
        }),
      });

      await expect(aucationApi.deleteBid(1)).rejects.toThrow("Tawaran tidak ada");
    });

    it("should throw fallback error on delete bid fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(aucationApi.deleteBid(1)).rejects.toThrow("Gagal membatalkan penawaran");
    });
  });

  describe("deleteAucations", () => {
    it("should delete all auctions and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus semua data pelelangan",
        }),
      });

      const res = await aucationApi.deleteAucations();
      expect(res).toBe("Berhasil menghapus semua data pelelangan");
    });

    it("should throw error on delete all fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Unauthenticated.",
        }),
      });

      await expect(aucationApi.deleteAucations()).rejects.toThrow("Unauthenticated.");
    });

    it("should throw fallback error on delete all fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(aucationApi.deleteAucations()).rejects.toThrow("Gagal menghapus semua lelang");
    });
  });
});
