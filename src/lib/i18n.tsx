import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "mr";

const dict = {
  appName: { en: "PMRD Smart Visitor System", mr: "PMRD स्मार्ट भेटकरी प्रणाली" },
  title: { en: "Smart Visitor Management System", mr: "स्मार्ट भेटकरी व्यवस्थापन प्रणाली" },
  subtitle: { en: "Secure, Fast & Digital Entry System", mr: "सुरक्षित, जलद आणि डिजिटल प्रवेश प्रणाली" },
  newRegistration: { en: "New Registration", mr: "नवीन नोंदणी" },
  login: { en: "Login", mr: "लॉगिन" },
  trackPass: { en: "Track Pass", mr: "पास ट्रॅक करा" },
  todayVisitors: { en: "Today's Visitors", mr: "आजचे भेटकरी" },
  activePasses: { en: "Active Passes", mr: "सक्रिय पास" },
  pendingApprovals: { en: "Pending Approvals", mr: "प्रलंबित मंजुरी" },
  dashboard: { en: "Dashboard", mr: "डॅशबोर्ड" },
  bookAppointment: { en: "Book Appointment", mr: "भेट नोंदवा" },
  myPasses: { en: "My Passes", mr: "माझे पास" },
  profile: { en: "Profile", mr: "प्रोफाइल" },
  logout: { en: "Logout", mr: "लॉगआउट" },
  admin: { en: "Security Console", mr: "सुरक्षा कक्ष" },
};

type Key = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k].en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (k: Key) => dict[k][lang];
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
