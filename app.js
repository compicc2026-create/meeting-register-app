(() => {
  "use strict";

  const LS_API_URL = "mr_api_url";
  const LS_CACHE = "mr_cache";
  const MAX_FILE_BYTES = 5 * 1024 * 1024;

  const ICONS = {
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    paperclip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
  };

  const LS_FILTERS = "mr_filters";
  const LS_THEME = "mr_theme";
  const LS_LANG = "mr_lang";

  const STRINGS = {
    en: {
      appTitle: "Meeting Register",
      offlineBanner: "You're offline — showing the last saved register. Changes will sync once you're back online.",
      setupBannerText: "Not connected to a Google Sheet yet.",
      connectNow: "Connect now",
      export: "Export",
      installApp: "Install app",
      newEntry: "New entry",
      statTotal: "Total logged",
      upcoming: "Upcoming",
      past: "Past",
      allDates: "All dates",
      all: "All",
      virtual: "Virtual",
      physical: "Physical",
      searchPlaceholder: "Search topic or location…",
      deleteSelected: "Delete selected",
      clear: "Clear",
      colNo: "No.",
      colTopic: "Topic & location",
      colWhen: "When",
      colType: "Type",
      colAttachment: "Attachment",
      meetingTopic: "Meeting topic",
      date: "Date",
      time: "Time",
      optional: "(optional)",
      type: "Type",
      meetingLink: "Meeting link",
      location: "Location",
      attachment: "Attachment",
      attachmentHint: "(optional, max 5MB)",
      remove: "Remove",
      cancel: "Cancel",
      saveEntry: "Save entry",
      saving: "Saving…",
      deleteBtn: "Delete",
      connectionSettings: "Connection settings",
      topicPlaceholder: "e.g. Quarterly budget review",
      datePlaceholder: "e.g. 14/08/2026",
      meetingLinkPlaceholder: "e.g. Google Meet link",
      locationPlaceholder: "e.g. Gulshan office, Room 4B",
      emptyRegisterTitle: "The register is empty",
      emptyRegisterCopy: "Log the first meeting to begin.",
      noMatchTitle: "No matching entries",
      noMatchCopy: "Try a different search or filter.",
      notConnectedTitle: "Not connected yet",
      notConnectedCopy: "Connect your Google Sheet to start logging meetings.",
      connected: "Connected",
      connecting: "Connecting…",
      offlineStatus: "Offline — showing cached data",
      notConnectedStatus: "Not connected",
      timeNotSet: "Time not set",
      loggedJustNow: "Logged just now",
      loggedMinAgo: (n) => `Logged ${n}m ago`,
      loggedHourAgo: (n) => `Logged ${n}h ago`,
      loggedDayAgo: (n) => `Logged ${n}d ago`,
      entryLogged: "Entry logged.",
      entryUpdated: "Entry updated.",
      entriesRemoved: (n) => `${n} ${n === 1 ? "entry" : "entries"} removed.`,
      undo: "Undo",
      nothingToExport: "Nothing to export for the current filters.",
      exportedEntries: (n) => `Exported ${n} ${n === 1 ? "entry" : "entries"}.`,
      couldntSave: "Couldn't save: ",
      couldntDelete: "Some entries couldn't be deleted — refreshing the register.",
      fillRequired: "Please fill in topic, date, and where.",
      fileTooLarge: "Attachment is larger than 5MB — please choose a smaller file.",
      newEntryTitle: "New entry",
      editEntryTitle: "Edit entry",
      duplicateEntryTitle: "Duplicate entry",
      removeEntryTitle: "Remove this entry?",
      removeEntriesTitle: (n) => `Remove ${n} entries?`,
      removeEntryCopy: "This row will be removed from your Google Sheet. You'll have a few seconds to undo right after.",
      removeEntriesCopy: "These rows will be removed from your Google Sheet. You'll have a few seconds to undo right after.",
      selected: (n) => `${n} selected`
    },
    bn: {
      appTitle: "মিটিং রেজিস্টার",
      offlineBanner: "আপনি অফলাইনে আছেন — সর্বশেষ সংরক্ষিত তথ্য দেখানো হচ্ছে। অনলাইনে ফিরলে পরিবর্তনগুলো সিঙ্ক হবে।",
      setupBannerText: "এখনও কোনো Google Sheet-এর সাথে সংযুক্ত নয়।",
      connectNow: "এখনই সংযুক্ত করুন",
      export: "এক্সপোর্ট",
      installApp: "অ্যাপ ইনস্টল করুন",
      newEntry: "নতুন এন্ট্রি",
      statTotal: "মোট এন্ট্রি",
      upcoming: "আসন্ন",
      past: "অতীত",
      allDates: "সব তারিখ",
      all: "সব",
      virtual: "ভার্চুয়াল",
      physical: "সরাসরি",
      searchPlaceholder: "বিষয় বা স্থান খুঁজুন…",
      deleteSelected: "নির্বাচিত মুছুন",
      clear: "সাফ করুন",
      colNo: "নং",
      colTopic: "বিষয় ও স্থান",
      colWhen: "সময়",
      colType: "ধরন",
      colAttachment: "সংযুক্তি",
      meetingTopic: "মিটিং বিষয়",
      date: "তারিখ",
      time: "সময়",
      optional: "(ঐচ্ছিক)",
      type: "ধরন",
      meetingLink: "মিটিং লিংক",
      location: "স্থান",
      attachment: "সংযুক্তি",
      attachmentHint: "(ঐচ্ছিক, সর্বোচ্চ ৫MB)",
      remove: "সরান",
      cancel: "বাতিল",
      saveEntry: "সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে…",
      deleteBtn: "মুছুন",
      connectionSettings: "সংযোগ সেটিংস",
      topicPlaceholder: "যেমন: ত্রৈমাসিক বাজেট পর্যালোচনা",
      datePlaceholder: "যেমন: ১৪/০৮/২০২৬",
      meetingLinkPlaceholder: "যেমন: Google Meet লিংক",
      locationPlaceholder: "যেমন: গুলশান অফিস, রুম ৪বি",
      emptyRegisterTitle: "রেজিস্টার খালি",
      emptyRegisterCopy: "শুরু করতে প্রথম মিটিং যুক্ত করুন।",
      noMatchTitle: "কোনো মিল পাওয়া যায়নি",
      noMatchCopy: "ভিন্ন অনুসন্ধান বা ফিল্টার ব্যবহার করে দেখুন।",
      notConnectedTitle: "এখনও সংযুক্ত হয়নি",
      notConnectedCopy: "মিটিং লগ করা শুরু করতে আপনার Google Sheet সংযুক্ত করুন।",
      connected: "সংযুক্ত",
      connecting: "সংযুক্ত হচ্ছে…",
      offlineStatus: "অফলাইন — সংরক্ষিত তথ্য দেখানো হচ্ছে",
      notConnectedStatus: "সংযুক্ত নয়",
      timeNotSet: "সময় নির্ধারিত হয়নি",
      loggedJustNow: "এইমাত্র যুক্ত হয়েছে",
      loggedMinAgo: (n) => `${n} মিনিট আগে যুক্ত হয়েছে`,
      loggedHourAgo: (n) => `${n} ঘণ্টা আগে যুক্ত হয়েছে`,
      loggedDayAgo: (n) => `${n} দিন আগে যুক্ত হয়েছে`,
      entryLogged: "এন্ট্রি সংরক্ষিত হয়েছে।",
      entryUpdated: "এন্ট্রি হালনাগাদ হয়েছে।",
      entriesRemoved: (n) => `${n}টি এন্ট্রি সরানো হয়েছে।`,
      undo: "পূর্বাবস্থায় ফিরুন",
      nothingToExport: "বর্তমান ফিল্টারে এক্সপোর্ট করার কিছু নেই।",
      exportedEntries: (n) => `${n}টি এন্ট্রি এক্সপোর্ট হয়েছে।`,
      couldntSave: "সংরক্ষণ করা যায়নি: ",
      couldntDelete: "কিছু এন্ট্রি মুছে ফেলা যায়নি — রেজিস্টার রিফ্রেশ হচ্ছে।",
      fillRequired: "অনুগ্রহ করে বিষয়, তারিখ এবং স্থান পূরণ করুন।",
      fileTooLarge: "সংযুক্তিটি ৫MB-এর চেয়ে বড় — অনুগ্রহ করে ছোট ফাইল বেছে নিন।",
      newEntryTitle: "নতুন এন্ট্রি",
      editEntryTitle: "এন্ট্রি সম্পাদনা",
      duplicateEntryTitle: "এন্ট্রি অনুলিপি",
      removeEntryTitle: "এই এন্ট্রিটি সরাবেন?",
      removeEntriesTitle: (n) => `${n}টি এন্ট্রি সরাবেন?`,
      removeEntryCopy: "এই সারিটি আপনার Google Sheet থেকে সরানো হবে। এরপর পূর্বাবস্থায় ফেরানোর জন্য কয়েক সেকেন্ড সময় পাবেন।",
      removeEntriesCopy: "এই সারিগুলো আপনার Google Sheet থেকে সরানো হবে। এরপর পূর্বাবস্থায় ফেরানোর জন্য কয়েক সেকেন্ড সময় পাবেন।",
      selected: (n) => `${n}টি নির্বাচিত`
    }
  };
  let currentLang = "en";
  function t(key, ...args) {
    const entry = (STRINGS[currentLang] && STRINGS[currentLang][key]) ?? STRINGS.en[key];
    return typeof entry === "function" ? entry(...args) : entry;
  }

  /** ---------- State ---------- */
  let meetings = [];
  let filters = { type: "all", time: "upcoming", search: "" };
  let sortState = { key: "when", dir: "asc" };
  let apiUrl = localStorage.getItem(LS_API_URL) || "";
  let deferredInstallPrompt = null;
  let existingFileForEdit = null; // {name, url} kept when editing and no new file chosen
  let hasLoadedOnce = false;
  let selectedIds = new Set();
  let pendingDeleteIds = [];
  let pendingRemoval = null; // { ids, items, timer } — set while an undo-able delete is in flight
  let lastConnectionState = "disconnected";

  /** ---------- DOM refs ---------- */
  const $ = (id) => document.getElementById(id);
  const registerBody = $("registerBody");
  const offlineBanner = $("offlineBanner");
  const setupBanner = $("setupBanner");
  const todayLabel = $("todayLabel");
  const toastEl = $("toast");

  const entryModal = $("entryModal");
  const entryForm = $("entryForm");
  const settingsModal = $("settingsModal");
  const deleteModal = $("deleteModal");

  /** ---------- Init ---------- */
  function init() {
    loadPersistedFilters();
    applyPersistedUIState();
    applyLanguage(localStorage.getItem(LS_LANG) || "en");
    applyTheme(localStorage.getItem(LS_THEME) || "light");
    wireEvents();
    registerServiceWorker();
    setupInstallPrompt();
    setupScrollShadow();
    setupKeyboardShortcuts();

    const cached = readCache();
    if (cached) {
      meetings = cached;
      hasLoadedOnce = true;
      render();
    }

    if (!apiUrl) {
      setupBanner.hidden = false;
      setConnectionStatus("disconnected");
      render();
    } else {
      setConnectionStatus(cached ? "connected" : "loading");
      if (!cached) renderSkeleton();
      fetchMeetings();
    }

    window.addEventListener("online", () => { offlineBanner.hidden = true; fetchMeetings(); });
    window.addEventListener("offline", () => { offlineBanner.hidden = false; setConnectionStatus("offline"); });
  }

  function loadPersistedFilters() {
    try {
      const raw = localStorage.getItem(LS_FILTERS);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.type) filters.type = saved.type;
      if (saved.time) filters.time = saved.time;
      if (saved.sortKey) sortState.key = saved.sortKey;
      if (saved.sortDir) sortState.dir = saved.sortDir;
    } catch { /* ignore malformed storage */ }
  }
  function persistFilters() {
    try {
      localStorage.setItem(LS_FILTERS, JSON.stringify({
        type: filters.type, time: filters.time, sortKey: sortState.key, sortDir: sortState.dir
      }));
    } catch { /* storage full/unavailable */ }
  }

  function applyPersistedUIState() {
    document.querySelectorAll("#typeTabs .tab").forEach((b) => b.classList.toggle("active", b.dataset.type === filters.type));
    document.querySelectorAll("#timeTabs .tab").forEach((b) => b.classList.toggle("active", b.dataset.time === filters.time));
    document.querySelectorAll(".sort-head").forEach((b) => {
      const isActive = b.dataset.sort === sortState.key;
      if (isActive) { b.setAttribute("data-active", ""); b.setAttribute("data-dir", sortState.dir); }
      else { b.removeAttribute("data-active"); b.removeAttribute("data-dir"); }
    });
  }

  function wireEvents() {
    $("newBtn").addEventListener("click", () => openEntryModal());
    $("settingsBtn").addEventListener("click", () => openSettingsModal());
    $("setupBannerBtn").addEventListener("click", () => openSettingsModal());
    $("installBtn").addEventListener("click", onInstallClick);

    $("searchInput").addEventListener("input", (e) => {
      filters.search = e.target.value.trim().toLowerCase();
      render();
    });

    document.getElementById("typeTabs").addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      setActiveTab("typeTabs", btn);
      filters.type = btn.dataset.type;
      persistFilters();
      render();
    });
    document.getElementById("timeTabs").addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      setActiveTab("timeTabs", btn);
      filters.time = btn.dataset.time;
      persistFilters();
      render();
    });

    document.querySelectorAll(".sort-head").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.sort;
        if (sortState.key === key) {
          sortState.dir = sortState.dir === "asc" ? "desc" : "asc";
        } else {
          sortState.key = key;
          sortState.dir = "asc";
        }
        applyPersistedUIState();
        persistFilters();
        render();
      });
    });

    $("exportBtn").addEventListener("click", exportCsv);
    $("themeToggleBtn").addEventListener("click", () => {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
    $("langToggleBtn").addEventListener("click", () => {
      applyLanguage(currentLang === "en" ? "bn" : "en");
    });

    $("selectAllCheckbox").addEventListener("change", (e) => {
      const visibleIds = getFiltered().map((m) => m.id);
      if (e.target.checked) visibleIds.forEach((id) => selectedIds.add(id));
      else visibleIds.forEach((id) => selectedIds.delete(id));
      render();
    });
    $("bulkClearBtn").addEventListener("click", () => { selectedIds.clear(); render(); });
    $("bulkDeleteBtn").addEventListener("click", () => {
      pendingDeleteIds = Array.from(selectedIds);
      openDeleteModal(pendingDeleteIds.length);
    });

    $("fieldType").addEventListener("change", (e) => {
      const isVirtual = e.target.value === "virtual";
      $("fieldWhereLabel").textContent = isVirtual ? t("meetingLink") : t("location");
      $("fieldWhere").placeholder = isVirtual ? t("meetingLinkPlaceholder") : t("locationPlaceholder");
    });

    $("closeEntryModal").addEventListener("click", () => entryModal.close());
    $("cancelEntry").addEventListener("click", () => entryModal.close());
    entryForm.addEventListener("submit", onSubmitEntry);
    $("removeFileBtn").addEventListener("click", () => {
      existingFileForEdit = null;
      $("existingFile").hidden = true;
      $("fieldFile").value = "";
    });

    $("closeSettingsModal").addEventListener("click", () => settingsModal.close());
    $("cancelSettings").addEventListener("click", () => settingsModal.close());
    $("saveSettingsBtn").addEventListener("click", onSaveSettings);

    $("cancelDelete").addEventListener("click", () => { pendingDeleteIds = []; deleteModal.close(); });
    $("confirmDelete").addEventListener("click", onConfirmDelete);

    // Delegate edit/duplicate/delete/select clicks from rendered rows
    registerBody.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".edit-btn");
      const dupBtn = e.target.closest(".duplicate-btn");
      const delBtn = e.target.closest(".delete-btn");
      if (editBtn) {
        const id = editBtn.closest(".entry").dataset.id;
        const meeting = meetings.find((m) => m.id === id);
        if (meeting) openEntryModal(meeting);
      } else if (dupBtn) {
        const id = dupBtn.closest(".entry").dataset.id;
        const meeting = meetings.find((m) => m.id === id);
        if (meeting) openEntryModal(null, meeting);
      } else if (delBtn) {
        pendingDeleteIds = [delBtn.closest(".entry").dataset.id];
        openDeleteModal(1);
      }
    });
    registerBody.addEventListener("change", (e) => {
      const cb = e.target.closest(".row-select");
      if (!cb) return;
      const id = cb.closest(".entry").dataset.id;
      if (cb.checked) selectedIds.add(id); else selectedIds.delete(id);
      render();
    });
  }

  function setActiveTab(groupId, activeBtn) {
    document.querySelectorAll(`#${groupId} .tab`).forEach((b) => b.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $("themeIconMoon").hidden = theme === "dark";
    $("themeIconSun").hidden = theme !== "dark";
    try { localStorage.setItem(LS_THEME, theme); } catch { /* storage full/unavailable */ }
  }

  function applyLanguage(lang) {
    currentLang = STRINGS[lang] ? lang : "en";
    document.documentElement.lang = currentLang;
    $("langToggleLabel").textContent = currentLang === "en" ? "বাং" : "EN";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (STRINGS.en[key] !== undefined) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (STRINGS.en[key] !== undefined) el.placeholder = t(key);
    });

    // Fields whose label/placeholder depends on the selected meeting type
    const isVirtual = $("fieldType").value !== "physical";
    $("fieldWhereLabel").textContent = isVirtual ? t("meetingLink") : t("location");
    $("fieldWhere").placeholder = isVirtual ? t("meetingLinkPlaceholder") : t("locationPlaceholder");

    todayLabel.textContent = new Intl.DateTimeFormat(currentLang === "bn" ? "bn-BD" : undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    }).format(new Date());

    try { localStorage.setItem(LS_LANG, currentLang); } catch { /* storage full/unavailable */ }
    setConnectionStatus(lastConnectionState);
    render();
  }

  function openDeleteModal(count) {
    $("deleteModalTitle").textContent = count > 1 ? t("removeEntriesTitle", count) : t("removeEntryTitle");
    $("deleteModalCopy").textContent = count > 1 ? t("removeEntriesCopy") : t("removeEntryCopy");
    deleteModal.showModal();
  }

  function updateBulkBar() {
    const bar = $("bulkBar");
    const count = selectedIds.size;
    bar.hidden = count === 0;
    if (count > 0) $("bulkCount").textContent = t("selected", count);

    const visibleIds = getFiltered().map((m) => m.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
    const someSelected = visibleIds.some((id) => selectedIds.has(id));
    const selectAll = $("selectAllCheckbox");
    selectAll.checked = allSelected;
    selectAll.indeterminate = someSelected && !allSelected;
  }

  function setupScrollShadow() {
    const masthead = document.querySelector(".masthead");
    window.addEventListener("scroll", () => {
      masthead.classList.toggle("is-scrolled", window.scrollY > 4);
    }, { passive: true });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
      const anyModalOpen = entryModal.open || settingsModal.open || deleteModal.open;
      if (typing || anyModalOpen) return;

      if (e.key === "/") {
        e.preventDefault();
        $("searchInput").focus();
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        openEntryModal();
      }
    });
  }

  function setConnectionStatus(state) {
    lastConnectionState = state;
    const dot = $("statusDot");
    const text = $("statusText");
    dot.className = "status-dot";
    if (state === "connected") {
      dot.classList.add("is-connected");
      text.textContent = t("connected");
    } else if (state === "offline") {
      dot.classList.add("is-offline");
      text.textContent = t("offlineStatus");
    } else if (state === "loading") {
      text.textContent = t("connecting");
    } else {
      text.textContent = t("notConnectedStatus");
    }
  }

  function renderSkeleton() {
    registerBody.innerHTML = Array.from({ length: 4 }).map(() => `<div class="skeleton-row"></div>`).join("");
  }

  function relativeTime(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const diffMs = Date.now() - d.getTime();
    const mins = Math.round(diffMs / 60000);
    if (mins < 1) return t("loggedJustNow");
    if (mins < 60) return t("loggedMinAgo", mins);
    const hours = Math.round(mins / 60);
    if (hours < 24) return t("loggedHourAgo", hours);
    const days = Math.round(hours / 24);
    if (days < 30) return t("loggedDayAgo", days);
    return new Intl.DateTimeFormat(currentLang === "bn" ? "bn-BD" : undefined, { day: "numeric", month: "short" }).format(d);
  }

  function csvEscape(val) {
    const s = String(val ?? "");
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportCsv() {
    const rows = getFiltered();
    if (rows.length === 0) {
      toast(t("nothingToExport"));
      return;
    }
    const header = ["Topic", "Date", "Time", "Where", "Type", "Attachment URL"];
    const lines = [header.join(",")];
    rows.forEach((m) => {
      lines.push([m.topic, m.date, m.time, m.where, m.type, m.fileUrl || ""].map(csvEscape).join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Intl.DateTimeFormat("en-CA").format(new Date()); // YYYY-MM-DD
    a.href = url;
    a.download = `meeting-register-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(t("exportedEntries", rows.length));
  }

  /** ---------- Networking ---------- */
  async function fetchMeetings() {
    if (!apiUrl) return;
    try {
      const res = await fetch(`${apiUrl}?action=list`, { method: "GET" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      meetings = data.meetings || [];
      writeCache(meetings);
      offlineBanner.hidden = true;
      hasLoadedOnce = true;
      setConnectionStatus("connected");
      render();
    } catch (err) {
      offlineBanner.hidden = false;
      setConnectionStatus("offline");
      if (meetings.length === 0) {
        const cached = readCache();
        if (cached) { meetings = cached; render(); }
        else render();
      }
    }
  }

  async function apiPost(payload) {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight on Apps Script
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  /** ---------- Rendering ---------- */
  // Date and Time are free-text fields, so parsing is best-effort. When a
  // value can't be parsed, entries fall back to createdAt order and are
  // treated as "upcoming" rather than silently dropped from view.
  function parseWhen(m) {
    const raw = `${m.date || ""} ${m.time || ""}`.trim();
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d) ? null : d;
  }

  function getFiltered() {
    const now = new Date();
    return meetings
      .filter((m) => filters.type === "all" || m.type === filters.type)
      .filter((m) => {
        if (filters.time === "all") return true;
        const when = parseWhen(m);
        if (!when) return filters.time === "upcoming"; // undated -> show under Upcoming only
        return filters.time === "upcoming" ? when >= now : when < now;
      })
      .filter((m) => {
        if (!filters.search) return true;
        const hay = `${m.topic} ${m.where} ${m.date} ${m.time}`.toLowerCase();
        return hay.includes(filters.search);
      })
      .sort(compareEntries);
  }

  function sortByWhen(a, b) {
    const da = parseWhen(a), db = parseWhen(b);
    if (da && db) return da - db;
    if (da) return -1;
    if (db) return 1;
    return new Date(a.createdAt) - new Date(b.createdAt);
  }

  function compareEntries(a, b) {
    let cmp;
    if (sortState.key === "topic") {
      cmp = (a.topic || "").localeCompare(b.topic || "", undefined, { sensitivity: "base" });
    } else {
      cmp = sortByWhen(a, b);
    }
    return sortState.dir === "asc" ? cmp : -cmp;
  }

  function render() {
    updateStats();
    const list = getFiltered();
    updateBulkBar();

    if (!apiUrl) {
      registerBody.innerHTML = emptyState(
        t("notConnectedTitle"),
        t("notConnectedCopy"),
        t("connectNow"),
        "openSettings"
      );
      return;
    }

    if (list.length === 0) {
      registerBody.innerHTML = meetings.length === 0
        ? emptyState(t("emptyRegisterTitle"), t("emptyRegisterCopy"), "+ " + t("newEntry"), "openNew")
        : emptyState(t("noMatchTitle"), t("noMatchCopy"), "", "");
      return;
    }

    // Chronological ledger numbering across the full sorted dataset
    const allSorted = [...meetings].sort(sortByWhen);
    const numberOf = new Map(allSorted.map((m, i) => [m.id, i + 1]));

    registerBody.innerHTML = list.map((m) => entryRow(m, numberOf.get(m.id))).join("");
  }

  function updateStats() {
    const now = new Date();
    const upcoming = meetings.filter((m) => {
      const d = parseWhen(m);
      return !d || d >= now;
    }).length;
    const virtual = meetings.filter((m) => m.type === "virtual").length;
    const physical = meetings.filter((m) => m.type === "physical").length;
    $("statTotal").textContent = meetings.length;
    $("statUpcoming").textContent = upcoming;
    $("statVirtual").textContent = virtual;
    $("statPhysical").textContent = physical;
  }

  function emptyState(title, copy, actionLabel, action) {
    const btn = actionLabel
      ? `<button class="btn btn-primary" onclick="window.__mr_${action}()">${actionLabel}</button>`
      : "";
    window.__mr_openSettings = () => openSettingsModal();
    window.__mr_openNew = () => openEntryModal();
    const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
    return `<div class="state-block"><div class="state-icon">${icon}</div><h3>${title}</h3><p>${copy}</p>${btn}</div>`;
  }

  function entryRow(m, num) {
    const dateStr = m.date ? escapeHtml(m.date) : "—";
    const timeStr = m.time ? escapeHtml(m.time) : t("timeNotSet");
    const timeClass = m.time ? "when-time" : "when-time when-time-empty";
    const typeLabel = m.type === "virtual" ? t("virtual") : t("physical");
    const fileHtml = m.fileUrl
      ? `<a class="file-chip" href="${escapeAttr(m.fileUrl)}" target="_blank" rel="noopener">${ICONS.paperclip} ${escapeHtml(truncate(m.fileName || "file", 22))}</a>`
      : `<span class="no-file">—</span>`;
    const loggedStr = m.createdAt ? relativeTime(m.createdAt) : "";
    const checked = selectedIds.has(m.id);

    return `
      <article class="entry entry-${m.type}${checked ? " is-selected" : ""}" data-id="${escapeAttr(m.id)}">
        <input type="checkbox" class="row-select" aria-label="Select entry" ${checked ? "checked" : ""} />
        <div class="entry-num">No. ${String(num).padStart(3, "0")}${loggedStr ? `<span class="entry-logged">${escapeHtml(loggedStr)}</span>` : ""}</div>
        <div class="entry-main">
          <h3 class="entry-topic">${escapeHtml(m.topic)}</h3>
          <p class="entry-where">${escapeHtml(m.where)}</p>
        </div>
        <div class="entry-when">
          <span class="when-date">${dateStr}</span>
          <span class="${timeClass}">${timeStr}</span>
        </div>
        <div class="entry-type"><span class="stamp stamp-${m.type}">${typeLabel}</span></div>
        <div class="entry-file">${fileHtml}</div>
        <div class="entry-actions">
          <button class="icon-btn edit-btn" title="Edit" aria-label="Edit entry">${ICONS.edit}</button>
          <button class="icon-btn duplicate-btn" title="Duplicate" aria-label="Duplicate entry">${ICONS.copy}</button>
          <button class="icon-btn delete-btn" title="Delete" aria-label="Delete entry">${ICONS.trash}</button>
        </div>
      </article>`;
  }

  /** ---------- Entry modal (create/edit) ---------- */
  function openEntryModal(meeting, duplicateFrom) {
    entryForm.reset();
    $("entryError").hidden = true;
    existingFileForEdit = null;
    $("existingFile").hidden = true;

    if (meeting) {
      $("entryModalTitle").textContent = t("editEntryTitle");
      $("entryId").value = meeting.id;
      $("fieldTopic").value = meeting.topic || "";
      $("fieldDate").value = meeting.date || "";
      $("fieldTime").value = meeting.time || "";
      $("fieldType").value = meeting.type || "virtual";
      $("fieldWhere").value = meeting.where || "";
      $("fieldWhereLabel").textContent = meeting.type === "virtual" ? t("meetingLink") : t("location");
      if (meeting.fileUrl) {
        existingFileForEdit = { name: meeting.fileName, url: meeting.fileUrl };
        $("existingFileLink").href = meeting.fileUrl;
        $("existingFileLink").innerHTML = ICONS.paperclip + " " + escapeHtml(meeting.fileName || "current attachment");
        $("existingFile").hidden = false;
      }
    } else if (duplicateFrom) {
      $("entryModalTitle").textContent = t("duplicateEntryTitle");
      $("entryId").value = "";
      $("fieldTopic").value = duplicateFrom.topic || "";
      $("fieldDate").value = duplicateFrom.date || "";
      $("fieldTime").value = duplicateFrom.time || "";
      $("fieldType").value = duplicateFrom.type || "virtual";
      $("fieldWhere").value = duplicateFrom.where || "";
      $("fieldWhereLabel").textContent = duplicateFrom.type === "virtual" ? t("meetingLink") : t("location");
      // Attachments are not copied — each logged meeting keeps its own file.
    } else {
      $("entryModalTitle").textContent = t("newEntryTitle");
      $("entryId").value = "";
      $("fieldType").value = "virtual";
      $("fieldWhereLabel").textContent = t("meetingLink");
    }

    entryModal.showModal();
    $("fieldTopic").focus();
  }

  async function onSubmitEntry(e) {
    e.preventDefault();
    const errorEl = $("entryError");
    errorEl.hidden = true;

    if (!apiUrl) {
      entryModal.close();
      openSettingsModal();
      return;
    }

    const id = $("entryId").value;
    const topic = $("fieldTopic").value.trim();
    const date = $("fieldDate").value.trim();
    const time = $("fieldTime").value.trim();
    const type = $("fieldType").value;
    const where = $("fieldWhere").value.trim();
    const fileInput = $("fieldFile");
    const file = fileInput.files[0];

    if (!topic || !date || !where) {
      errorEl.textContent = t("fillRequired");
      errorEl.hidden = false;
      return;
    }
    if (file && file.size > MAX_FILE_BYTES) {
      errorEl.textContent = t("fileTooLarge");
      errorEl.hidden = false;
      return;
    }

    const saveBtn = $("saveEntryBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving…";

    try {
      const payload = {
        action: id ? "update" : "create",
        id: id || undefined,
        topic,
        date,
        time,
        type,
        where
      };
      if (file) {
        payload.file = {
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          data: await fileToBase64(file)
        };
      } else if (id && !existingFileForEdit) {
        payload.removeFile = true;
      }

      await apiPost(payload);
      entryModal.close();
      toast(id ? t("entryUpdated") : t("entryLogged"));
      fetchMeetings();
    } catch (err) {
      errorEl.textContent = t("couldntSave") + err.message;
      errorEl.hidden = false;
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save entry";
    }
  }

  /** ---------- Delete (with undo) ---------- */
  async function onConfirmDelete() {
    if (pendingDeleteIds.length === 0) return;
    deleteModal.close();
    scheduleRemoval(pendingDeleteIds);
    pendingDeleteIds = [];
  }

  function scheduleRemoval(ids) {
    // Optimistic local removal with a grace period before the delete is
    // actually sent to the backend, so the person can undo their mind.
    if (pendingRemoval) {
      clearTimeout(pendingRemoval.timer);
      commitRemoval(pendingRemoval.ids); // flush any earlier pending delete first
    }

    const items = meetings.filter((m) => ids.includes(m.id));
    meetings = meetings.filter((m) => !ids.includes(m.id));
    ids.forEach((id) => selectedIds.delete(id));
    render();

    const timer = setTimeout(() => commitRemoval(ids), 5500);
    pendingRemoval = { ids, items, timer };

    toast(t("entriesRemoved", items.length), {
      actionLabel: t("undo"),
      onAction: undoRemoval,
      duration: 5500
    });
  }

  function undoRemoval() {
    if (!pendingRemoval) return;
    clearTimeout(pendingRemoval.timer);
    meetings = meetings.concat(pendingRemoval.items);
    pendingRemoval = null;
    render();
  }

  async function commitRemoval(ids) {
    pendingRemoval = null;
    try {
      for (const id of ids) {
        await apiPost({ action: "delete", id });
      }
    } catch (err) {
      toast(t("couldntDelete"));
    } finally {
      fetchMeetings();
    }
  }

  /** ---------- Settings ---------- */
  function openSettingsModal() {
    $("apiUrlInput").value = apiUrl;
    $("settingsError").hidden = true;
    $("settingsSuccess").hidden = true;
    settingsModal.showModal();
  }

  async function onSaveSettings() {
    const val = $("apiUrlInput").value.trim();
    const errorEl = $("settingsError");
    const successEl = $("settingsSuccess");
    errorEl.hidden = true;
    successEl.hidden = true;

    if (!val || !val.startsWith("https://script.google.com/")) {
      errorEl.textContent = "That doesn't look like an Apps Script Web App URL. It should start with https://script.google.com/";
      errorEl.hidden = false;
      return;
    }

    const btn = $("saveSettingsBtn");
    btn.disabled = true;
    btn.textContent = "Testing…";

    const previous = apiUrl;
    apiUrl = val;
    try {
      const res = await fetch(`${apiUrl}?action=list`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.setItem(LS_API_URL, apiUrl);
      meetings = data.meetings || [];
      writeCache(meetings);
      hasLoadedOnce = true;
      setupBanner.hidden = true;
      setConnectionStatus("connected");
      successEl.hidden = false;
      render();
      setTimeout(() => settingsModal.close(), 700);
    } catch (err) {
      apiUrl = previous;
      errorEl.textContent = "Couldn't connect: " + err.message;
      errorEl.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = "Save & connect";
    }
  }

  /** ---------- Helpers ---------- */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function truncate(str, n) {
    return str.length > n ? str.slice(0, n - 1) + "…" : str;
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }

  function toast(msg, opts) {
    const { actionLabel, onAction, duration = 3200 } = opts || {};
    toastEl.innerHTML = "";
    toastEl.appendChild(document.createTextNode(msg));
    if (actionLabel && onAction) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toast-action";
      btn.textContent = actionLabel;
      btn.addEventListener("click", () => {
        onAction();
        hideToast();
      });
      toastEl.appendChild(btn);
    }
    toastEl.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(hideToast, duration);
  }
  function hideToast() {
    toastEl.hidden = true;
    clearTimeout(toast._t);
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(LS_CACHE);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(LS_CACHE, JSON.stringify(data)); } catch { /* storage full/unavailable */ }
  }

  /** ---------- PWA install ---------- */
  function setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      $("installBtn").hidden = false;
    });
    window.addEventListener("appinstalled", () => {
      $("installBtn").hidden = true;
      deferredInstallPrompt = null;
    });
  }
  async function onInstallClick() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $("installBtn").hidden = true;
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch(() => {});
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
