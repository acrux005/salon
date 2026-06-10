import "dotenv/config";
import bcrypt from "bcrypt";
import { getPrisma } from "../lib/db";

async function main() {
  const prisma = getPrisma();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword && adminPassword.length >= 10) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.upsert({
      where: { email: adminEmail.toLowerCase().trim() },
      create: { email: adminEmail.toLowerCase().trim(), passwordHash: hash },
      update: { passwordHash: hash },
    });
    console.log("Admin account", adminEmail, "created/updated.");
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD (min 10 znaków) nie ustawione — pomijam konto admina.");
  }

  const workingHours = JSON.stringify(
    Array.from({ length: 7 }, () => ({ open: "10:00", close: "22:00" }))
  );

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "pizza-demo" },
    create: {
      slug: "pizza-demo",
      name: "Pizza Demo",
      city: "Warszawa",
      description: "Pizza, dania na wynos. Zamów online.",
      address: "ul. Przykładowa 1",
      phone: "+48 123 456 789",
      isPublished: true,
      workingHours,
      orderAheadDays: 3,
      slotDurationMinutes: 30,
      allowDelivery: true,
    },
    update: { name: "Pizza Demo", city: "Warszawa", description: "Pizza, dania na wynos. Zamów online." },
  });

  const catPizza = await prisma.menuCategory.upsert({
    where: { id: "seed-cat-pizza" },
    create: {
      id: "seed-cat-pizza",
      restaurantId: restaurant.id,
      name: "Pizza",
      order: 0,
    },
    update: { name: "Pizza" },
  });

  const catNapoje = await prisma.menuCategory.upsert({
    where: { id: "seed-cat-napoje" },
    create: {
      id: "seed-cat-napoje",
      restaurantId: restaurant.id,
      name: "Napoje",
      order: 1,
    },
    update: { name: "Napoje" },
  });

  await prisma.menuItem.upsert({
    where: { id: "seed-item-margherita" },
    create: {
      id: "seed-item-margherita",
      restaurantId: restaurant.id,
      categoryId: catPizza.id,
      name: "Margherita",
      description: "Pomidor, mozzarella, bazylia",
      pricePlz: 24,
      isAvailable: true,
      order: 0,
    },
    update: { name: "Margherita", pricePlz: 24 },
  });

  await prisma.menuItem.upsert({
    where: { id: "seed-item-pepperoni" },
    create: {
      id: "seed-item-pepperoni",
      restaurantId: restaurant.id,
      categoryId: catPizza.id,
      name: "Pepperoni",
      description: "Pomidor, mozzarella, pepperoni",
      pricePlz: 28,
      isAvailable: true,
      order: 1,
    },
    update: { name: "Pepperoni", pricePlz: 28 },
  });

  await prisma.menuItem.upsert({
    where: { id: "seed-item-cola" },
    create: {
      id: "seed-item-cola",
      restaurantId: restaurant.id,
      categoryId: catNapoje.id,
      name: "Cola 0.33l",
      pricePlz: 6,
      isAvailable: true,
      order: 0,
    },
    update: { name: "Cola 0.33l", pricePlz: 6 },
  });

  console.log("Restaurant Pizza Demo + menu seeded.");

  const demoRestaurantPassword = process.env.DEMO_RESTAURANT_PASSWORD;
  if (demoRestaurantPassword && demoRestaurantPassword.length >= 10) {
    const hash = await bcrypt.hash(demoRestaurantPassword, 10);
    await prisma.restaurantAccount.upsert({
      where: { email: "demo@zamow.odart.pl" },
      create: {
        email: "demo@zamow.odart.pl",
        passwordHash: hash,
        restaurantId: restaurant.id,
        emailVerifiedAt: new Date(),
      },
      update: { passwordHash: hash },
    });
    console.log("Demo restaurant account demo@zamow.odart.pl created/updated.");
  } else {
    console.log("DEMO_RESTAURANT_PASSWORD not set or too short (min 10) — skipping demo restaurant account.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
