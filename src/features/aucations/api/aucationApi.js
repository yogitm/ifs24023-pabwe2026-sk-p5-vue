import apiHelper from "../../../helpers/apiHelper";

const aucationApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/aucations`;

  function _url(path = "") {
    return BASE_URL + path;
  }

  async function getAucations(isMe = null, isClosed = null) {
    const params = new URLSearchParams();
    if (isMe !== null && isMe !== undefined) {
      params.append("is_me", isMe ? "1" : "0");
    }
    if (isClosed !== null && isClosed !== undefined) {
      params.append("is_closed", isClosed ? "1" : "0");
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiHelper.fetchData(_url(query), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data lelang");
    }

    return result.data?.aucations || [];
  }

  async function getAucationById(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail lelang");
    }

    return result.data?.aucation;
  }

  async function postAucation(title, description, startBid, closedAt) {
    const response = await apiHelper.fetchData(_url(""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        start_bid: Number(startBid),
        closed_at: closedAt,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      const errorDetails =
        result.data && typeof result.data === "object"
          ? Object.values(result.data).flat().join(", ")
          : "";
      const baseMsg = result.message || "Gagal membuat sesi lelang";
      throw new Error(errorDetails ? `${baseMsg}: ${errorDetails}` : baseMsg);
    }

    return result.data?.aucation || result.message;
  }

  async function putAucation(id, title, description, startBid, closedAt) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        start_bid: Number(startBid),
        closed_at: closedAt,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      const errorDetails =
        result.data && typeof result.data === "object"
          ? Object.values(result.data).flat().join(", ")
          : "";
      const baseMsg = result.message || "Gagal mengubah data lelang";
      throw new Error(errorDetails ? `${baseMsg}: ${errorDetails}` : baseMsg);
    }

    return result.message;
  }

  async function postAucationCover(id, coverFile) {
    const formData = new FormData();
    formData.append("cover", coverFile, coverFile.name || "cover.jpg");

    const response = await apiHelper.fetchData(_url(`/${id}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover lelang");
    }

    return result.message;
  }

  async function deleteAucation(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus lelang");
    }

    return result.message;
  }

  async function postBid(id, bid) {
    const response = await apiHelper.fetchData(_url(`/${id}/bids`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bid: Number(bid),
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      const errorDetails =
        result.data && typeof result.data === "object"
          ? Object.values(result.data).flat().join(", ")
          : "";
      const baseMsg = result.message || "Gagal mengajukan penawaran";
      throw new Error(errorDetails ? `${baseMsg}: ${errorDetails}` : baseMsg);
    }

    return result.message;
  }

  async function deleteBid(id) {
    const response = await apiHelper.fetchData(_url(`/${id}/bids`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal membatalkan penawaran");
    }

    return result.message;
  }

  async function deleteAucations() {
    const response = await apiHelper.fetchData(_url(""), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus semua lelang");
    }

    return result.message;
  }

  return {
    getAucations,
    getAucationById,
    postAucation,
    putAucation,
    postAucationCover,
    deleteAucation,
    postBid,
    deleteBid,
    deleteAucations,
  };
})();

export default aucationApi;
