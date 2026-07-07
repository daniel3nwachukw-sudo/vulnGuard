import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(raw) as User[];
  } catch (err) {
    // If file missing, return empty
    return [];
  }
}

async function writeUsers(users: User[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function addUser(user: Omit<User, 'createdAt'>): Promise<User> {
  const users = await readUsers();
  const newUser: User = { ...user, createdAt: new Date().toISOString() };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}
