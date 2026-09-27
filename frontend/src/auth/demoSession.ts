export type DemoRole = "student" | "lecturer" | "admin";

export type DemoSession = {
  role: DemoRole;
  studentId?: string;
  studentNumber?: string;
  firstName?: string;
  lastName?: string;
};

const SESSION_KEY = "studentreach.demo-session";

export function getDemoSession(): DemoSession | null {
  const value = sessionStorage.getItem(SESSION_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as DemoSession;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setDemoSession(session: DemoSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
