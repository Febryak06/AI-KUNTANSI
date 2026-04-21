import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  PenSquare,
  BookOpen,
  Wallet,
  FileBarChart2,
  Settings,
  LifeBuoy,
  LogIn,
  UserPlus,
  Sparkles,
  Briefcase,
  Trash2,
  Pencil,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const today = new Date().toISOString().slice(0, 10);

const defaultAccounts = [
  { code: "101", name: "Kas", category: "aset", normal: "debit" },
  { code: "102", name: "Bank", category: "aset", normal: "debit" },
  { code: "103", name: "Piutang Usaha", category: "aset", normal: "debit" },
  { code: "104", name: "Persediaan Barang Dagang", category: "aset", normal: "debit" },
  { code: "105", name: "Perlengkapan", category: "aset", normal: "debit" },
  { code: "106", name: "Sewa Dibayar di Muka", category: "aset", normal: "debit" },
  { code: "107", name: "Peralatan", category: "aset", normal: "debit" },
  { code: "201", name: "Utang Usaha", category: "liabilitas", normal: "credit" },
  { code: "202", name: "Utang Gaji", category: "liabilitas", normal: "credit" },
  { code: "203", name: "Utang Listrik dan Air", category: "liabilitas", normal: "credit" },
  { code: "301", name: "Modal Pemilik", category: "ekuitas", normal: "credit" },
  { code: "302", name: "Prive", category: "ekuitas", normal: "debit" },
  { code: "303", name: "Saldo Laba", category: "ekuitas", normal: "credit" },
  { code: "401", name: "Penjualan", category: "pendapatan", normal: "credit" },
  { code: "402", name: "Pendapatan Jasa", category: "pendapatan", normal: "credit" },
  { code: "403", name: "Pendapatan Lain-lain", category: "pendapatan", normal: "credit" },
  { code: "501", name: "Beban Gaji", category: "beban", normal: "debit" },
  { code: "502", name: "Beban Sewa", category: "beban", normal: "debit" },
  { code: "503", name: "Beban Listrik", category: "beban", normal: "debit" },
  { code: "504", name: "Beban Air", category: "beban", normal: "debit" },
  { code: "505", name: "Beban Transportasi", category: "beban", normal: "debit" },
  { code: "506", name: "Beban Perlengkapan", category: "beban", normal: "debit" },
  { code: "507", name: "Beban Penyusutan", category: "beban", normal: "debit" },
  { code: "508", name: "Beban Lain-lain", category: "beban", normal: "debit" },
];

const navigation = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "input", label: "Input", icon: PenSquare },
  { key: "journal", label: "Jurnal", icon: BookOpen },
  { key: "ledger", label: "Buku Besar", icon: Wallet },
  { key: "reports", label: "Laporan", icon: FileBarChart2 },
  { key: "accounts", label: "Akun", icon: Briefcase },
  { key: "settings", label: "Pengaturan", icon: Settings },
  { key: "help", label: "Bantuan", icon: LifeBuoy },
];

const transactionModes = [
  {
    key: "pemasukan",
    label: "Pemasukan Tunai/Bank",
    helper: "Kas atau Bank bertambah dari pendapatan.",
  },
  {
    key: "pengeluaran",
    label: "Pengeluaran Tunai/Bank",
    helper: "Kas atau Bank berkurang untuk beban atau pembelian aset.",
  },
  {
    key: "modal",
    label: "Setor Modal",
    helper: "Dana pemilik masuk sebagai modal.",
  },
  {
    key: "prive",
    label: "Prive",
    helper: "Pengambilan dana pribadi oleh pemilik.",
  },
  {
    key: "penjualan_kredit",
    label: "Penjualan Kredit",
    helper: "Pendapatan dicatat sebagai piutang.",
  },
  {
    key: "pembelian_kredit",
    label: "Pembelian Kredit",
    helper: "Aset dibeli dan dicatat sebagai utang usaha.",
  },
  {
    key: "terima_piutang",
    label: "Penerimaan Piutang",
    helper: "Kas atau Bank bertambah dari pelunasan piutang.",
  },
  {
    key: "bayar_utang",
    label: "Pembayaran Utang",
    helper: "Kas atau Bank berkurang untuk melunasi utang.",
  },
];

const demoTransactions = [
  {
    id: "seed-1",
    date: today,
    mode: "modal",
    mainAccount: "Modal Pemilik",
    cashAccount: "Kas",
    amount: 5000000,
    description: "Setoran modal awal usaha",
    entries: [
      { account: "Kas", side: "debit", amount: 5000000 },
      { account: "Modal Pemilik", side: "credit", amount: 5000000 },
    ],
  },
  {
    id: "seed-2",
    date: today,
    mode: "pemasukan",
    mainAccount: "Penjualan",
    cashAccount: "Kas",
    amount: 850000,
    description: "Penjualan tunai hari ini",
    entries: [
      { account: "Kas", side: "debit", amount: 850000 },
      { account: "Penjualan", side: "credit", amount: 850000 },
    ],
  },
  {
    id: "seed-3",
    date: today,
    mode: "pengeluaran",
    mainAccount: "Beban Listrik",
    cashAccount: "Kas",
    amount: 175000,
    description: "Pembayaran listrik toko",
    entries: [
      { account: "Beban Listrik", side: "debit", amount: 175000 },
      { account: "Kas", side: "credit", amount: 175000 },
    ],
  },
];

const inputModeStyles = {
  pemasukan: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pengeluaran: "bg-rose-50 text-rose-700 border-rose-200",
  modal: "bg-blue-50 text-blue-700 border-blue-200",
  prive: "bg-amber-50 text-amber-700 border-amber-200",
  penjualan_kredit: "bg-violet-50 text-violet-700 border-violet-200",
  pembelian_kredit: "bg-indigo-50 text-indigo-700 border-indigo-200",
  terima_piutang: "bg-cyan-50 text-cyan-700 border-cyan-200",
  bayar_utang: "bg-orange-50 text-orange-700 border-orange-200",
};

const cardClass = "rounded-3xl border border-slate-200 bg-white shadow-sm";

function getAccountMap(accounts) {
  return accounts.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});
}

function buildMainAccountOptions(mode, accounts) {
  const byCategory = (category) => accounts.filter((item) => item.category === category).map((item) => item.name);
  const asetOperational = ["Persediaan Barang Dagang", "Perlengkapan", "Sewa Dibayar di Muka", "Peralatan"];

  switch (mode) {
    case "pemasukan":
      return byCategory("pendapatan");
    case "pengeluaran":
      return [...asetOperational, ...byCategory("beban")];
    case "modal":
      return ["Modal Pemilik"];
    case "prive":
      return ["Prive"];
    case "penjualan_kredit":
      return ["Penjualan", "Pendapatan Jasa", "Pendapatan Lain-lain"];
    case "pembelian_kredit":
      return asetOperational;
    case "terima_piutang":
      return ["Piutang Usaha"];
    case "bayar_utang":
      return ["Utang Usaha"];
    default:
      return [];
  }
}

function buildEntries(form) {
  const amount = Number(form.amount || 0);
  const cash = form.cashAccount || "Kas";
  const main = form.mainAccount;

  if (!amount || !main) return [];

  switch (form.mode) {
    case "pemasukan":
      return [
        { account: cash, side: "debit", amount },
        { account: main, side: "credit", amount },
      ];
    case "pengeluaran":
      return [
        { account: main, side: "debit", amount },
        { account: cash, side: "credit", amount },
      ];
    case "modal":
      return [
        { account: cash, side: "debit", amount },
        { account: "Modal Pemilik", side: "credit", amount },
      ];
    case "prive":
      return [
        { account: "Prive", side: "debit", amount },
        { account: cash, side: "credit", amount },
      ];
    case "penjualan_kredit":
      return [
        { account: "Piutang Usaha", side: "debit", amount },
        { account: main, side: "credit", amount },
      ];
    case "pembelian_kredit":
      return [
        { account: main, side: "debit", amount },
        { account: "Utang Usaha", side: "credit", amount },
      ];
    case "terima_piutang":
      return [
        { account: cash, side: "debit", amount },
        { account: "Piutang Usaha", side: "credit", amount },
      ];
    case "bayar_utang":
      return [
        { account: "Utang Usaha", side: "debit", amount },
        { account: cash, side: "credit", amount },
      ];
    default:
      return [];
  }
}

function StatCard({ title, value, hint }) {
  return (
    <div className={`${cardClass} p-5`}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export default function AIKuntanApp() {
  const [stage, setStage] = useState("landing");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("Kas");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [settings, setSettings] = useState({
    businessName: "Usaha Saya",
    ownerName: "",
    email: "",
    currency: "IDR",
    period: "Bulanan",
  });
  const [form, setForm] = useState({
    date: today,
    mode: "pemasukan",
    mainAccount: "Penjualan",
    cashAccount: "Kas",
    amount: "",
    description: "",
  });
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-kuntan-state-v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTransactions(parsed.transactions || []);
      setAccounts(parsed.accounts || defaultAccounts);
      setSettings(parsed.settings || settings);
      return;
    }
    setTransactions(demoTransactions);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ai-kuntan-state-v1",
      JSON.stringify({ transactions, accounts, settings })
    );
  }, [transactions, accounts, settings]);

  const accountMap = useMemo(() => getAccountMap(accounts), [accounts]);

  const mainAccountOptions = useMemo(() => buildMainAccountOptions(form.mode, accounts), [form.mode, accounts]);

  useEffect(() => {
    if (!mainAccountOptions.includes(form.mainAccount)) {
      setForm((prev) => ({ ...prev, mainAccount: mainAccountOptions[0] || "" }));
    }
  }, [form.mode, mainAccountOptions]);

  const previewEntries = useMemo(() => buildEntries(form), [form]);

  const journalRows = useMemo(() => {
    return transactions
      .flatMap((tx) =>
        tx.entries.map((entry, index) => ({
          transactionId: tx.id,
          txNumber: tx.id.slice(-6).toUpperCase(),
          date: tx.date,
          description: tx.description,
          account: entry.account,
          debit: entry.side === "debit" ? entry.amount : 0,
          credit: entry.side === "credit" ? entry.amount : 0,
          order: index,
          mode: tx.mode,
        }))
      )
      .sort((a, b) => (a.date === b.date ? a.order - b.order : a.date > b.date ? -1 : 1));
  }, [transactions]);

  const ledger = useMemo(() => {
    const grouped = {};
    accounts.forEach((account) => {
      grouped[account.name] = [];
    });

    const chronological = [...transactions].sort((a, b) => (a.date > b.date ? 1 : -1));
    chronological.forEach((tx) => {
      tx.entries.forEach((entry) => {
        if (!grouped[entry.account]) grouped[entry.account] = [];
        grouped[entry.account].push({
          date: tx.date,
          description: tx.description,
          debit: entry.side === "debit" ? entry.amount : 0,
          credit: entry.side === "credit" ? entry.amount : 0,
          transactionId: tx.id,
        });
      });
    });

    Object.entries(grouped).forEach(([accountName, rows]) => {
      const normal = accountMap[accountName]?.normal || "debit";
      let running = 0;
      rows.forEach((row) => {
        running += normal === "debit" ? row.debit - row.credit : row.credit - row.debit;
        row.balance = running;
      });
    });

    return grouped;
  }, [transactions, accounts, accountMap]);

  const trialBalance = useMemo(() => {
    return accounts.map((account) => {
      const rows = ledger[account.name] || [];
      const debitTotal = rows.reduce((sum, row) => sum + row.debit, 0);
      const creditTotal = rows.reduce((sum, row) => sum + row.credit, 0);
      const balance = account.normal === "debit" ? debitTotal - creditTotal : creditTotal - debitTotal;
      return {
        ...account,
        debitTotal,
        creditTotal,
        balance,
        debitBalance: account.normal === "debit" ? Math.max(balance, 0) : Math.max(-balance, 0),
        creditBalance: account.normal === "credit" ? Math.max(balance, 0) : Math.max(-balance, 0),
      };
    });
  }, [accounts, ledger]);

  const totals = useMemo(() => {
    const getCategoryTotal = (category) =>
      trialBalance
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + (item.normal === "debit" ? item.debitBalance : item.creditBalance), 0);

    const revenues = trialBalance
      .filter((item) => item.category === "pendapatan")
      .reduce((sum, item) => sum + item.creditBalance, 0);

    const expenses = trialBalance
      .filter((item) => item.category === "beban")
      .reduce((sum, item) => sum + item.debitBalance, 0);

    const rawEquity = trialBalance
      .filter((item) => item.category === "ekuitas")
      .reduce((sum, item) => {
        return sum + (item.normal === "credit" ? item.creditBalance : -item.debitBalance);
      }, 0);

    const netIncome = revenues - expenses;
    const assets = getCategoryTotal("aset");
    const liabilities = getCategoryTotal("liabilitas");
    const equity = rawEquity + netIncome;

    return {
      cash: (trialBalance.find((item) => item.name === "Kas")?.debitBalance || 0) + (trialBalance.find((item) => item.name === "Bank")?.debitBalance || 0),
      income: revenues,
      expense: expenses,
      netIncome,
      assets,
      liabilities,
      equity,
      trialDebit: trialBalance.reduce((sum, item) => sum + item.debitBalance, 0),
      trialCredit: trialBalance.reduce((sum, item) => sum + item.creditBalance, 0),
    };
  }, [trialBalance]);

  const incomeRows = trialBalance.filter((item) => item.category === "pendapatan" && item.creditBalance > 0);
  const expenseRows = trialBalance.filter((item) => item.category === "beban" && item.debitBalance > 0);
  const assetRows = trialBalance.filter((item) => item.category === "aset" && item.debitBalance > 0);
  const liabilityRows = trialBalance.filter((item) => item.category === "liabilitas" && item.creditBalance > 0);
  const equityRows = trialBalance.filter((item) => item.category === "ekuitas" && (item.creditBalance > 0 || item.debitBalance > 0));

  const recentTransactions = [...transactions].sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 5);

  const cashAccounts = accounts.filter((item) => ["Kas", "Bank"].includes(item.name)).map((item) => item.name);

  const handleSaveTransaction = () => {
    const entries = buildEntries(form);
    if (!form.date || !form.amount || Number(form.amount) <= 0 || entries.length !== 2) return;

    const payload = {
      id: editingId || `TX-${Date.now()}`,
      date: form.date,
      mode: form.mode,
      mainAccount: form.mainAccount,
      cashAccount: form.cashAccount,
      amount: Number(form.amount),
      description: form.description || transactionModes.find((item) => item.key === form.mode)?.label || "Transaksi",
      entries,
    };

    if (editingId) {
      setTransactions((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
      setEditingId(null);
    } else {
      setTransactions((prev) => [payload, ...prev]);
    }

    setForm({
      date: today,
      mode: "pemasukan",
      mainAccount: "Penjualan",
      cashAccount: "Kas",
      amount: "",
      description: "",
    });
    setActivePage("journal");
  };

  const startEditTransaction = (tx) => {
    setEditingId(tx.id);
    setForm({
      date: tx.date,
      mode: tx.mode,
      mainAccount: tx.mainAccount,
      cashAccount: tx.cashAccount || "Kas",
      amount: String(tx.amount),
      description: tx.description,
    });
    setSelectedTransaction(null);
    setActivePage("input");
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    if (selectedTransaction?.id === id) setSelectedTransaction(null);
  };

  const resetDemo = () => {
    setTransactions(demoTransactions);
    setActivePage("dashboard");
  };

  const resetAll = () => {
    setTransactions([]);
    setSelectedTransaction(null);
    setEditingId(null);
    setActivePage("dashboard");
  };

  const addDefaultAccount = () => {
    const nextNumber = 600 + accounts.length + 1;
    setAccounts((prev) => [
      ...prev,
      {
        code: String(nextNumber),
        name: `Akun Baru ${prev.length - defaultAccounts.length + 1}`,
        category: "beban",
        normal: "debit",
      },
    ]);
  };

  const handleMockLogin = () => {
    setSettings((prev) => ({ ...prev, ownerName: authForm.name || prev.ownerName, email: authForm.email || prev.email }));
    setStage("app");
  };

  const sidebar = (
    <aside className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-lg font-bold text-white">
          AI
        </div>
        <div>
          <p className="text-sm text-slate-500">Aplikasi Akuntansi</p>
          <h1 className="text-lg font-semibold text-slate-900">AI-kuntan</h1>
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActivePage(item.key);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Otomatis dari Input
        </div>
        <p className="mt-2 text-sm text-slate-200">
          Pengguna hanya mengisi transaksi. Jurnal, buku besar, neraca saldo, dan laporan keuangan tersusun otomatis.
        </p>
      </div>
    </aside>
  );

  if (stage === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 font-bold text-white">
                AI
              </div>
              <div>
                <p className="text-sm text-slate-500">Aplikasi Akuntansi Dasar</p>
                <h1 className="text-lg font-semibold">AI-kuntan</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStage("login")}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Masuk
              </button>
              <button
                onClick={() => setStage("register")}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Coba Aplikasi
              </button>
            </div>
          </div>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-700 p-8 text-white shadow-sm sm:p-10">
              <Badge tone="blue">Siap dipakai di HP dan laptop</Badge>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
                Catat transaksi sekali, semua laporan akuntansi tersusun otomatis.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
                AI-kuntan membantu Anda mencatat transaksi dengan alur sederhana. Setelah input disimpan, sistem langsung membentuk jurnal umum, buku besar, neraca saldo, laporan posisi keuangan, laporan laba rugi, dan laporan perubahan ekuitas dalam satu aplikasi terintegrasi.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setStage("register")}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Daftar Sekarang
                </button>
                <button
                  onClick={() => setStage("login")}
                  className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Masuk
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-slate-200">Input sederhana</p>
                  <p className="mt-2 text-xl font-semibold">1 halaman utama</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-slate-200">Pemrosesan cerdas</p>
                  <p className="mt-2 text-xl font-semibold">Jurnal otomatis</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-slate-200">Laporan lengkap</p>
                  <p className="mt-2 text-xl font-semibold">Real-time</p>
                </div>
              </div>
            </div>

            <div className={`${cardClass} overflow-hidden p-5`}>
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Preview Dashboard</p>
                    <h3 className="text-lg font-semibold">Ringkasan Keuangan</h3>
                  </div>
                  <Badge tone="emerald">Otomatis</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-300">Kas & Bank</p>
                    <p className="mt-2 text-xl font-semibold">{money(5675000)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-300">Laba Bersih</p>
                    <p className="mt-2 text-xl font-semibold">{money(675000)}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/10 p-4">
                  <div className="flex items-end justify-between gap-3">
                    {[45, 75, 55, 92, 70, 84].map((bar, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-full bg-white/10">
                          <div className="rounded-full bg-emerald-400" style={{ height: `${bar}px` }} />
                        </div>
                        <span className="text-[10px] text-slate-300">M{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {["Input transaksi sekali", "Jurnal, buku besar, dan neraca saldo otomatis", "Laporan keuangan siap dibaca di semua device"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <div className={`${cardClass} p-6`}>
              <h3 className="text-lg font-semibold">Untuk mahasiswa</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cocok untuk belajar siklus akuntansi secara praktis karena hasil jurnal dan laporan tampil otomatis dari transaksi yang diinput.
              </p>
            </div>
            <div className={`${cardClass} p-6`}>
              <h3 className="text-lg font-semibold">Untuk UMKM</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Membantu pencatatan usaha harian seperti penjualan, beban, modal, utang, dan piutang tanpa menyusun laporan manual.
              </p>
            </div>
            <div className={`${cardClass} p-6`}>
              <h3 className="text-lg font-semibold">Untuk pemula</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Interface dibuat sederhana, adaptif, dan fokus pada satu aktivitas utama yaitu input transaksi.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (stage === "login" || stage === "register") {
    const isRegister = stage === "register";
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-700 p-10 text-white lg:block">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">AI</div>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">AI-kuntan</h2>
            <p className="mt-4 text-base leading-7 text-slate-100">
              Pengguna cukup fokus pada input transaksi, sedangkan jurnal umum, buku besar, neraca saldo, dan laporan keuangan dibuat otomatis oleh sistem.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "Responsif di HP dan laptop",
                "Daftar akun umum untuk mahasiswa dan UMKM",
                "Laporan keuangan real-time dari transaksi yang sama",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <button onClick={() => setStage("landing")} className="mb-6 text-sm text-slate-500 hover:text-slate-900">
              ← Kembali ke landing page
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 font-bold text-white">
                AI
              </div>
              <div>
                <p className="text-sm text-slate-500">Akses aplikasi</p>
                <h1 className="text-2xl font-semibold text-slate-900">{isRegister ? "Daftar Akun" : "Masuk ke AI-kuntan"}</h1>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {isRegister && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Nama lengkap</span>
                  <input
                    value={authForm.name}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="Masukkan nama lengkap"
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email atau username</span>
                <input
                  value={authForm.email}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="nama@contoh.com"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Masukkan password"
                />
              </label>
              <button
                onClick={handleMockLogin}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {isRegister ? "Buat Akun dan Masuk" : "Masuk"}
              </button>
              <button
                onClick={handleMockLogin}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Lanjutkan dengan Google
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <button>{isRegister ? "Sudah punya akun?" : "Lupa kata sandi?"}</button>
              <button onClick={() => setStage(isRegister ? "login" : "register")} className="font-medium text-slate-900">
                {isRegister ? "Masuk" : "Daftar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Dashboard"
        subtitle="Ringkasan kondisi keuangan dan status otomatisasi laporan dari transaksi yang sudah Anda input."
        action={
          <div className="flex flex-wrap gap-2">
            <button onClick={resetDemo} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Muat Data Contoh
            </button>
            <button onClick={() => setActivePage("input")} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Input Transaksi
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Kas & Bank" value={money(totals.cash)} hint="Saldo akun Kas dan Bank" />
        <StatCard title="Total Pemasukan" value={money(totals.income)} hint="Akumulasi pendapatan" />
        <StatCard title="Total Pengeluaran" value={money(totals.expense)} hint="Akumulasi beban dan biaya" />
        <StatCard title="Laba / Rugi Bersih" value={money(totals.netIncome)} hint="Hasil pendapatan dikurangi beban" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={`${cardClass} p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Arus Kinerja Sederhana</h3>
              <p className="mt-1 text-sm text-slate-500">Perbandingan ringkas pemasukan, pengeluaran, dan laba bersih.</p>
            </div>
            <Badge tone="blue">Real-time</Badge>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { label: "Pemasukan", value: totals.income },
              { label: "Pengeluaran", value: totals.expense },
              { label: "Laba Bersih", value: Math.max(totals.netIncome, 0) },
            ].map((item) => {
              const base = Math.max(totals.income, totals.expense, Math.abs(totals.netIncome), 1);
              const height = `${Math.max((item.value / base) * 180, 12)}px`;
              return (
                <div key={item.label} className="flex flex-col items-center justify-end rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">{item.label}</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">{money(item.value)}</div>
                  <div className="mt-6 flex h-48 items-end">
                    <div className="w-20 rounded-t-3xl bg-gradient-to-t from-slate-900 to-emerald-500" style={{ height }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Transaksi Terbaru</h3>
              <p className="mt-1 text-sm text-slate-500">Data ini menjadi sumber untuk jurnal, buku besar, neraca saldo, dan laporan.</p>
            </div>
            <Badge tone="emerald">Sinkron</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                Belum ada transaksi. Mulai dari halaman input transaksi.
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                    <p className="mt-1 text-xs text-slate-500">{tx.date} · {tx.mainAccount}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${inputModeStyles[tx.mode] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                      {transactionModes.find((item) => item.key === tx.mode)?.label || tx.mode}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{money(tx.amount)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInput = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Input Transaksi"
        subtitle="Satu-satunya halaman yang perlu diisi pengguna. Sistem akan membentuk jurnal umum, buku besar, neraca saldo, dan laporan keuangan secara otomatis."
        action={editingId ? <Badge tone="amber">Mode Edit Transaksi</Badge> : <Badge tone="blue">Otomatisasi Aktif</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={`${cardClass} p-6`}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Tanggal transaksi</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Mode transaksi</span>
              <select
                value={form.mode}
                onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              >
                {transactionModes.map((mode) => (
                  <option key={mode.key} value={mode.key}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">{transactionModes.find((item) => item.key === form.mode)?.helper}</p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Akun utama</span>
              <select
                value={form.mainAccount}
                onChange={(e) => setForm((prev) => ({ ...prev, mainAccount: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              >
                {mainAccountOptions.map((account) => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Kas / Bank</span>
              <select
                value={form.cashAccount}
                onChange={(e) => setForm((prev) => ({ ...prev, cashAccount: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              >
                {cashAccounts.map((account) => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nominal</span>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Contoh: 250000"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Keterangan transaksi</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Tulis keterangan singkat transaksi"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSaveTransaction}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {editingId ? "Perbarui dan Sinkronkan Ulang" : "Simpan dan Proses Otomatis"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ date: today, mode: "pemasukan", mainAccount: "Penjualan", cashAccount: "Kas", amount: "", description: "" });
                }}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Batal Edit
              </button>
            )}
          </div>
        </div>

        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Preview Jurnal Otomatis</h3>
              <p className="mt-1 text-sm text-slate-500">Sistem menyiapkan jurnal dari input yang Anda isi.</p>
            </div>
            <Badge tone="emerald">Auto</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {previewEntries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                Isi nominal dan pilih akun utama untuk melihat preview otomatis.
              </div>
            ) : (
              previewEntries.map((entry, index) => (
                <div key={`${entry.account}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{entry.account}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{entry.side === "debit" ? "Debit" : "Kredit"}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{money(entry.amount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <h4 className="text-sm font-semibold text-slate-900">Alur otomatis setelah disimpan</h4>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div>1. Sistem membuat jurnal umum.</div>
              <div>2. Sistem memposting mutasi ke buku besar akun terkait.</div>
              <div>3. Sistem menyusun neraca saldo dari seluruh akun.</div>
              <div>4. Sistem memperbarui laporan posisi keuangan, laba rugi, dan perubahan ekuitas.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Jurnal Umum"
        subtitle="Halaman ini sepenuhnya dihasilkan otomatis dari transaksi pada halaman input transaksi."
        action={<Badge tone="blue">Read Only</Badge>}
      />
      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 font-medium">Tanggal</th>
                <th className="px-5 py-4 font-medium">No. Transaksi</th>
                <th className="px-5 py-4 font-medium">Keterangan</th>
                <th className="px-5 py-4 font-medium">Akun</th>
                <th className="px-5 py-4 font-medium text-right">Debit</th>
                <th className="px-5 py-4 font-medium text-right">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {journalRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-slate-500">
                    Belum ada jurnal. Input transaksi terlebih dahulu.
                  </td>
                </tr>
              ) : (
                journalRows.map((row, index) => (
                  <tr key={`${row.transactionId}-${index}`} className="border-t border-slate-100">
                    <td className="px-5 py-4">{row.date}</td>
                    <td className="px-5 py-4">{row.txNumber}</td>
                    <td className="px-5 py-4">{row.description}</td>
                    <td className="px-5 py-4">{row.account}</td>
                    <td className="px-5 py-4 text-right">{row.debit ? money(row.debit) : "—"}</td>
                    <td className="px-5 py-4 text-right">{row.credit ? money(row.credit) : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLedger = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Buku Besar"
        subtitle="Mutasi akun dibuat otomatis berdasarkan jurnal yang berasal dari halaman input transaksi."
        action={<Badge tone="blue">Terposting Otomatis</Badge>}
      />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className={`${cardClass} p-4`}>
          <h3 className="px-2 text-sm font-semibold text-slate-900">Daftar Akun</h3>
          <div className="mt-3 space-y-1">
            {accounts.map((account) => (
              <button
                key={account.name}
                onClick={() => setSelectedAccount(account.name)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                  selectedAccount === account.name
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{account.name}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] uppercase ${selectedAccount === account.name ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {account.code}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Mutasi {selectedAccount}</h3>
            <p className="mt-1 text-sm text-slate-500">Saldo berjalan menyesuaikan karakter akun secara otomatis.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-medium">Tanggal</th>
                  <th className="px-5 py-4 font-medium">Keterangan</th>
                  <th className="px-5 py-4 font-medium text-right">Debit</th>
                  <th className="px-5 py-4 font-medium text-right">Kredit</th>
                  <th className="px-5 py-4 font-medium text-right">Saldo Berjalan</th>
                </tr>
              </thead>
              <tbody>
                {(ledger[selectedAccount] || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-slate-500">
                      Belum ada mutasi pada akun ini.
                    </td>
                  </tr>
                ) : (
                  (ledger[selectedAccount] || []).map((row, index) => (
                    <tr key={`${row.transactionId}-${index}`} className="border-t border-slate-100">
                      <td className="px-5 py-4">{row.date}</td>
                      <td className="px-5 py-4">{row.description}</td>
                      <td className="px-5 py-4 text-right">{row.debit ? money(row.debit) : "—"}</td>
                      <td className="px-5 py-4 text-right">{row.credit ? money(row.credit) : "—"}</td>
                      <td className="px-5 py-4 text-right font-medium">{money(row.balance)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Neraca Saldo dan Laporan Keuangan"
        subtitle="Semua laporan diperbarui otomatis setiap kali transaksi disimpan atau diperbarui."
        action={<Badge tone={Math.abs(totals.trialDebit - totals.trialCredit) < 1 ? "emerald" : "rose"}>{Math.abs(totals.trialDebit - totals.trialCredit) < 1 ? "Seimbang" : "Perlu Cek"}</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Aset" value={money(totals.assets)} hint="Berdasarkan neraca saldo" />
        <StatCard title="Total Liabilitas" value={money(totals.liabilities)} hint="Kewajiban usaha" />
        <StatCard title="Total Ekuitas" value={money(totals.equity)} hint="Ekuitas setelah laba berjalan" />
        <StatCard title="Selisih Neraca Saldo" value={money(Math.abs(totals.trialDebit - totals.trialCredit))} hint="Harus nol agar seimbang" />
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Neraca Saldo</h3>
          <p className="mt-1 text-sm text-slate-500">Disusun otomatis dari saldo akhir setiap akun.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 font-medium">Kode</th>
                <th className="px-5 py-4 font-medium">Nama Akun</th>
                <th className="px-5 py-4 font-medium">Kategori</th>
                <th className="px-5 py-4 font-medium text-right">Debit</th>
                <th className="px-5 py-4 font-medium text-right">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {trialBalance.map((row) => (
                <tr key={row.code} className="border-t border-slate-100">
                  <td className="px-5 py-4">{row.code}</td>
                  <td className="px-5 py-4">{row.name}</td>
                  <td className="px-5 py-4 capitalize text-slate-500">{row.category}</td>
                  <td className="px-5 py-4 text-right">{row.debitBalance ? money(row.debitBalance) : "—"}</td>
                  <td className="px-5 py-4 text-right">{row.creditBalance ? money(row.creditBalance) : "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-slate-900">
              <tr>
                <td colSpan={3} className="px-5 py-4">Total</td>
                <td className="px-5 py-4 text-right">{money(totals.trialDebit)}</td>
                <td className="px-5 py-4 text-right">{money(totals.trialCredit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className={`${cardClass} p-6`}>
          <h3 className="text-lg font-semibold text-slate-900">Laporan Posisi Keuangan</h3>
          <p className="mt-1 text-sm text-slate-500">Aset, liabilitas, dan ekuitas tersusun dari transaksi yang sama.</p>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Aset</p>
              <div className="mt-2 space-y-2">
                {assetRows.map((row) => (
                  <div key={row.code} className="flex items-center justify-between text-sm text-slate-600">
                    <span>{row.name}</span>
                    <span>{money(row.debitBalance)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Liabilitas</p>
              <div className="mt-2 space-y-2">
                {liabilityRows.map((row) => (
                  <div key={row.code} className="flex items-center justify-between text-sm text-slate-600">
                    <span>{row.name}</span>
                    <span>{money(row.creditBalance)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ekuitas</p>
              <div className="mt-2 space-y-2">
                {equityRows.map((row) => (
                  <div key={row.code} className="flex items-center justify-between text-sm text-slate-600">
                    <span>{row.name}</span>
                    <span>{row.normal === "credit" ? money(row.creditBalance) : `(${money(row.debitBalance)})`}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>Laba berjalan</span>
                  <span>{money(totals.netIncome)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-slate-900">
              <span>Total Aset</span>
              <span>{money(totals.assets)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>Total Liabilitas + Ekuitas</span>
              <span>{money(totals.liabilities + totals.equity)}</span>
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-6`}>
          <h3 className="text-lg font-semibold text-slate-900">Laporan Laba Rugi</h3>
          <p className="mt-1 text-sm text-slate-500">Pendapatan dan beban periode berjalan.</p>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">Pendapatan</p>
              <div className="mt-2 space-y-2">
                {incomeRows.map((row) => (
                  <div key={row.code} className="flex items-center justify-between text-sm text-slate-600">
                    <span>{row.name}</span>
                    <span>{money(row.creditBalance)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Beban</p>
              <div className="mt-2 space-y-2">
                {expenseRows.map((row) => (
                  <div key={row.code} className="flex items-center justify-between text-sm text-slate-600">
                    <span>{row.name}</span>
                    <span>{money(row.debitBalance)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total Pendapatan</span>
                <span>{money(totals.income)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Total Beban</span>
                <span>{money(totals.expense)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Laba / Rugi Bersih</span>
                <span>{money(totals.netIncome)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-6`}>
          <h3 className="text-lg font-semibold text-slate-900">Laporan Perubahan Ekuitas</h3>
          <p className="mt-1 text-sm text-slate-500">Perubahan modal dari transaksi yang berjalan.</p>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Modal pemilik</span>
              <span>{money(trialBalance.find((item) => item.name === "Modal Pemilik")?.creditBalance || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Saldo laba awal</span>
              <span>{money(trialBalance.find((item) => item.name === "Saldo Laba")?.creditBalance || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Laba / rugi periode berjalan</span>
              <span>{money(totals.netIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Prive</span>
              <span>({money(trialBalance.find((item) => item.name === "Prive")?.debitBalance || 0)})</span>
            </div>
            <div className="border-t border-slate-100 pt-4 text-base font-semibold text-slate-900">
              <div className="flex items-center justify-between">
                <span>Ekuitas akhir</span>
                <span>{money(totals.equity)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Manajemen Akun"
        subtitle="Daftar akun umum untuk mahasiswa dan UMKM sudah tersedia sejak awal. Anda tetap dapat menambah atau menonaktifkan akun bila diperlukan."
        action={
          <button onClick={addDefaultAccount} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Tambah Akun
          </button>
        }
      />
      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 font-medium">Kode</th>
                <th className="px-5 py-4 font-medium">Nama Akun</th>
                <th className="px-5 py-4 font-medium">Kategori</th>
                <th className="px-5 py-4 font-medium">Saldo Normal</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.code} className="border-t border-slate-100">
                  <td className="px-5 py-4">{account.code}</td>
                  <td className="px-5 py-4">{account.name}</td>
                  <td className="px-5 py-4 capitalize">{account.category}</td>
                  <td className="px-5 py-4 capitalize">{account.normal === "credit" ? "Kredit" : "Debit"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Pengaturan"
        subtitle="Sesuaikan identitas usaha dan preferensi dasar aplikasi."
        action={<Badge tone="blue">Preferensi Dasar</Badge>}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className={`${cardClass} p-6`}>
          <h3 className="text-lg font-semibold text-slate-900">Profil dan Identitas Usaha</h3>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nama usaha</span>
              <input
                value={settings.businessName}
                onChange={(e) => setSettings((prev) => ({ ...prev, businessName: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nama pemilik</span>
              <input
                value={settings.ownerName}
                onChange={(e) => setSettings((prev) => ({ ...prev, ownerName: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                value={settings.email}
                onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>
          </div>
        </div>
        <div className={`${cardClass} p-6`}>
          <h3 className="text-lg font-semibold text-slate-900">Preferensi Sistem</h3>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Mata uang</span>
              <select
                value={settings.currency}
                onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              >
                <option value="IDR">Rupiah (IDR)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Periode akuntansi</span>
              <select
                value={settings.period}
                onChange={(e) => setSettings((prev) => ({ ...prev, period: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              >
                <option>Bulanan</option>
                <option>Triwulanan</option>
                <option>Tahunan</option>
              </select>
            </label>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              Proses akuntansi inti tetap berjalan otomatis. Pengguna tidak perlu mengatur jurnal, buku besar, neraca saldo, atau laporan secara manual.
            </div>
            <button onClick={resetAll} className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50">
              Hapus Semua Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <SectionTitle
        title="Bantuan dan Panduan"
        subtitle="Panduan singkat agar pengguna pemula tetap nyaman menggunakan aplikasi."
        action={<Badge tone="emerald">Mudah Dipahami</Badge>}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {[
          {
            title: "Cara menggunakan aplikasi",
            body: "Masuk ke halaman Input Transaksi, pilih mode transaksi yang sesuai, pilih akun utama, tentukan kas atau bank bila diperlukan, isi nominal dan keterangan, lalu simpan. Setelah itu jurnal umum, buku besar, neraca saldo, dan laporan keuangan diperbarui otomatis.",
          },
          {
            title: "Pengertian debit dan kredit secara sederhana",
            body: "Pada aplikasi ini, pengguna tidak perlu menentukan pasangan jurnal secara manual. Sistem akan membantu membentuk posisi debit dan kredit berdasarkan mode transaksi yang dipilih pada halaman input transaksi.",
          },
          {
            title: "Akun yang tersedia",
            body: "Akun umum yang disediakan meliputi Kas, Bank, Piutang Usaha, Persediaan Barang Dagang, Perlengkapan, Sewa Dibayar di Muka, Peralatan, Utang Usaha, Modal Pemilik, Prive, Penjualan, Pendapatan Jasa, serta berbagai beban umum seperti Beban Gaji, Beban Sewa, Beban Listrik, dan Beban Lain-lain.",
          },
          {
            title: "Membaca laporan",
            body: "Neraca saldo menampilkan keseimbangan debit dan kredit, laporan posisi keuangan menampilkan aset, liabilitas, dan ekuitas, laporan laba rugi menampilkan pendapatan dan beban, sedangkan laporan perubahan ekuitas menampilkan perubahan modal selama periode berjalan.",
          },
        ].map((item) => (
          <div key={item.title} className={`${cardClass} p-6`}>
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pageContent = {
    dashboard: renderDashboard(),
    input: renderInput(),
    journal: renderJournal(),
    ledger: renderLedger(),
    reports: renderReports(),
    accounts: renderAccounts(),
    settings: renderSettings(),
    help: renderHelp(),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 font-bold text-white">
              AI
            </div>
            <div>
              <p className="text-xs text-slate-500">{settings.businessName}</p>
              <h1 className="text-lg font-semibold">AI-kuntan</h1>
            </div>
          </div>
          <button onClick={() => setMobileOpen((prev) => !prev)} className="rounded-2xl border border-slate-200 p-3 text-slate-700">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mb-4 lg:hidden">{sidebar}</div>
        )}

        <div className="grid gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          <div className="hidden lg:block">{sidebar}</div>

          <main className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Selamat datang{settings.ownerName ? `, ${settings.ownerName}` : ""}</p>
                  <h2 className="text-xl font-semibold text-slate-900">{settings.businessName}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="emerald">{settings.period}</Badge>
                  <Badge tone="blue">{transactions.length} transaksi</Badge>
                  <button onClick={() => setStage("landing")} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Keluar
                  </button>
                </div>
              </div>
            </div>

            {pageContent[activePage]}
          </main>
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Detail transaksi</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{selectedTransaction.description}</h3>
              </div>
              <button onClick={() => setSelectedTransaction(null)} className="rounded-2xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Tanggal</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedTransaction.date}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Nominal</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{money(selectedTransaction.amount)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Mode dan akun utama</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {transactionModes.find((item) => item.key === selectedTransaction.mode)?.label || selectedTransaction.mode} · {selectedTransaction.mainAccount}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-900">Jurnal yang dihasilkan</h4>
              <div className="mt-3 space-y-3">
                {selectedTransaction.entries.map((entry, index) => (
                  <div key={`${entry.account}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{entry.account}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{entry.side === "debit" ? "Debit" : "Kredit"}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{money(entry.amount)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => startEditTransaction(selectedTransaction)} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800">
                <Pencil className="h-4 w-4" />
                Edit transaksi
              </button>
              <button onClick={() => deleteTransaction(selectedTransaction.id)} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50">
                <Trash2 className="h-4 w-4" />
                Hapus transaksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
