import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient, TableData } from "@prisma/client";

const prisma = new PrismaClient();

export function createRandomUser() {
  return {
    email: faker.internet.email(),
    name: faker.internet.username(), 
    phone: faker.phone.imei(),
    age: faker.date.birthdate(),
    gender: faker.person.gender()
  };
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 5000,
});

const userData: Omit<TableData,'id'>[] = [...users];

export async function main() {
    await prisma.tableData.createMany({ data: userData });
}

main();