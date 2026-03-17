import type { CreateUserInput } from "./users.schema.js";

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

const usersTable: User[] = [];
let currentId = 1;

export const usersRepo = {
  findAll(): User[] {
    return usersTable;
  },

  findById(id: number): User | undefined {
    return usersTable.find((user) => user.id === id);
  },

  findByEmail(email: string): User | undefined {
    return usersTable.find((user) => user.email === email);
  },

  create(payload: CreateUserInput): User {
    const user: User = {
      id: currentId++,
      name: payload.name,
      email: payload.email,
      createdAt: new Date()
    };

    usersTable.push(user);
    return user;
  },

  clear(): void {
    usersTable.length = 0;
    currentId = 1;
  }
};
