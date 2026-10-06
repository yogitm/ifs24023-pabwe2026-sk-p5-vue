import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUsersStore } from "./usersStore";
import userApi from "../api/userApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("usersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it("should have correct default state", () => {
    const store = useUsersStore();
    expect(store.users).toEqual([]);
    expect(store.user).toBeNull();
    expect(store.profile).toBeNull();
    expect(store.isProfile).toBe(false);
    expect(store.isChangeProfile).toBe(false);
    expect(store.isChangeProfilePhoto).toBe(false);
    expect(store.isChangeProfilePassword).toBe(false);
  });

  it("should update state with setters", () => {
    const store = useUsersStore();
    store.setUsers([{ id: 1 }]);
    expect(store.users).toEqual([{ id: 1 }]);

    store.setUser({ id: 2 });
    expect(store.user).toEqual({ id: 2 });

    store.setProfile({ id: 3 });
    expect(store.profile).toEqual({ id: 3 });

    store.setIsProfile(true);
    expect(store.isProfile).toBe(true);

    store.setIsChangeProfile(true);
    expect(store.isChangeProfile).toBe(true);

    store.setIsChangeProfilePhoto(true);
    expect(store.isChangeProfilePhoto).toBe(true);

    store.setIsChangeProfilePassword(true);
    expect(store.isChangeProfilePassword).toBe(true);
  });

  describe("asyncSetUsers", () => {
    it("should set users on success", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getUsers").mockResolvedValue([{ id: 1 }]);

      await store.asyncSetUsers();

      expect(store.users).toEqual([{ id: 1 }]);
    });

    it("should set empty array on error", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getUsers").mockRejectedValue(new Error("Error"));

      await store.asyncSetUsers();

      expect(store.users).toEqual([]);
    });
  });

  describe("asyncSetUserById", () => {
    it("should set user on success", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getUserById").mockResolvedValue({ id: 2 });

      await store.asyncSetUserById(2);

      expect(store.user).toEqual({ id: 2 });
    });

    it("should set null on error", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getUserById").mockRejectedValue(new Error("Error"));

      await store.asyncSetUserById(99);

      expect(store.user).toBeNull();
    });
  });

  describe("asyncSetProfile", () => {
    it("should set profile and setIsProfile to true on success", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 3 });

      await store.asyncSetProfile();

      expect(store.profile).toEqual({ id: 3 });
      expect(store.isProfile).toBe(true);
    });

    it("should set profile null and setIsProfile to true on error", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getProfile").mockRejectedValue(new Error("Error"));

      await store.asyncSetProfile();

      expect(store.profile).toBeNull();
      expect(store.isProfile).toBe(true);
    });
  });

  describe("asyncPutProfile", () => {
    it("should update profile and show success dialog", async () => {
      const store = useUsersStore();
      const updatedUser = { id: 1, name: "New Name", email: "new@del.org" };
      vi.spyOn(userApi, "putProfile").mockResolvedValue(updatedUser);
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPutProfile("New Name", "new@del.org");

      expect(store.profile).toEqual(updatedUser);
      expect(store.isChangeProfile).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Profil berhasil diperbarui!");
    });

    it("should handle error on failure", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "putProfile").mockRejectedValue(new Error("Fail"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncPutProfile("New Name", "new@del.org");

      expect(store.isChangeProfile).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith("Fail");
    });
  });

  describe("asyncPostProfilePhoto", () => {
    it("should upload photo and reload profile on success", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "postProfilePhoto").mockResolvedValue("Berhasil upload");
      vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 1, photo: "url" });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPostProfilePhoto(new File([""], "pic.png"));

      expect(successSpy).toHaveBeenCalledWith("Berhasil upload");
      expect(store.profile).toEqual({ id: 1, photo: "url" });
      expect(store.isChangeProfilePhoto).toBe(true);
    });

    it("should handle empty message on photo upload success", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "postProfilePhoto").mockResolvedValue("");
      vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 1 });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPostProfilePhoto(new File([""], "pic.png"));

      expect(successSpy).toHaveBeenCalledWith("Foto profil berhasil diperbarui!");
      expect(store.isChangeProfilePhoto).toBe(true);
    });

    it("should handle error on photo upload failure", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "postProfilePhoto").mockRejectedValue(new Error("Format salah"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncPostProfilePhoto(new File([""], "pic.png"));

      expect(store.isChangeProfilePhoto).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith("Format salah");
    });
  });

  describe("asyncPutProfilePassword", () => {
    it("should update password and show success on success", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "putProfilePassword").mockResolvedValue("Password ok");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPutProfilePassword("old", "new", "new");

      expect(successSpy).toHaveBeenCalledWith("Password ok");
      expect(store.isChangeProfilePassword).toBe(true);
    });

    it("should handle empty message fallback on password success", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "putProfilePassword").mockResolvedValue("");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await store.asyncPutProfilePassword("old", "new", "new");

      expect(successSpy).toHaveBeenCalledWith("Kata sandi berhasil diperbarui!");
      expect(store.isChangeProfilePassword).toBe(true);
    });

    it("should handle error on failure", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "putProfilePassword").mockRejectedValue(new Error("Password lama salah"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await store.asyncPutProfilePassword("old", "new", "new");

      expect(store.isChangeProfilePassword).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith("Password lama salah");
    });
  });
});
