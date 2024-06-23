// File: gameData.ts
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Item, Monster, Achievement } from "./types";
import { SkeletonSvg } from "./monsterSvgs";

export const heroClasses = [
  {
    name: "Warrior",
    baseHp: 120,
    baseMinDamage: 6,
    baseMaxDamage: 12,
    skills: [
      {
        name: "Slash",
        damage: 10,
        cooldown: 1000, // 5 seconds
        currentCooldown: 0,
        description: "A basic sword attack",
      },
      {
        name: "Block",
        damage: 0,
        cooldown: 3000, // 10 seconds
        currentCooldown: 0,
        description: "Reduce incoming damage and heal for 10 HP",
        effect: (hero: any) => ({
          healthChange: 10,
          message: "Hero uses Block! Gained 10 HP.",
        }),
      },
      {
        name: "Whirlwind",
        damage: 15,
        cooldown: 5000, // 15 seconds
        currentCooldown: 0,
        description: "A powerful spinning attack",
        effect: () => ({
          damageMultiplier: 1.5,
          message: "Hero uses Whirlwind! Damage increased by 50%.",
        }),
      },
    ],
  },
  // Add more hero classes here
];

export const itemTemplates: Omit<Item, "id">[] = [
  {
    baseId: "sw1",
    name: "Rusty Sword",
    type: "weapon",
    equippable: true,
    rarity: "common",
    effects: [{ type: "damage", value: 2 }],
    value: 10,
    stackable: true,
  },
  {
    baseId: "ar1",
    name: "Leather Vest",
    type: "armor",
    equippable: true,
    rarity: "common",
    effects: [{ type: "health", value: 10 }],
    value: 20,
    stackable: true,
  },
  {
    baseId: "pot1",
    name: "Minor Health Potion",
    type: "potion",
    rarity: "common",
    effects: [{ type: "health", value: 20 }],
    value: 5,
    stackable: true,
  },
  {
    baseId: "sw2",
    name: "Steel Sword",
    type: "weapon",
    rarity: "common",
    equippable: true,
    effects: [{ type: "damage", value: 5 }],
    value: 50,
    stackable: true,
  },
  {
    baseId: "sw3",
    name: "Gold Sword",
    type: "weapon",
    rarity: "rare",
    equippable: true,
    effects: [{ type: "damage", value: 8 }],
    value: 100,
    stackable: true,
  },
  {
    baseId: "ar2",
    name: "Leather Armor",
    type: "armor",
    rarity: "common",
    equippable: true,
    effects: [{ type: "health", value: 10 }],
    value: 30,
    stackable: true,
  },
  {
    baseId: "ar3",
    name: "Chain Mail",
    type: "armor",
    rarity: "rare",
    equippable: true,
    effects: [{ type: "health", value: 20 }],
    value: 80,
    stackable: true,
  },
  {
    baseId: "pot2",
    name: "Health Potion",
    type: "potion",
    rarity: "common",
    effects: [{ type: "health", value: 30 }],
    value: 20,
    stackable: true,
  },
  // Add more item templates here
];

export const monsterTypes: Monster[] = [
  {
    name: "Skeleton",
    hp: 50,
    maxHp: 50,
    xpReward: 30,
    goldReward: 15,
    SvgComponent: SkeletonSvg,
    lootTable: [
      {
        baseId: "sw1",
        weight: 50,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        baseId: "ar1",
        weight: 30,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        baseId: "pot1",
        weight: 70,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
    skills: [
      {
        name: "Bone Throw",
        damage: 5,
        cooldown: 1500,
        currentCooldown: 0,
        description: "Throws a bone at the hero",
        effect: () => ({ message: "Skeleton throws a bone!" }),
      },
      {
        name: "Skeletal Slash",
        damage: 8,
        cooldown: 3000,
        currentCooldown: 0,
        description: "A powerful slash with bony arms",
        effect: () => ({
          damageMultiplier: 1.2,
          message:
            "Skeleton performs a powerful slash! Damage increased by 20%.",
        }),
      },
    ],
  },
  // Add more monster types here
];

export const initialAchievements: Achievement[] = [
  {
    id: "ach1",
    name: "First Blood",
    description: "Defeat your first monster",
    isUnlocked: false,
  },
  {
    id: "ach2",
    name: "Treasure Hunter",
    description: "Collect 10 items",
    isUnlocked: false,
  },
  {
    id: "ach3",
    name: "Dragon Slayer",
    description: "Reach level 10",
    isUnlocked: false,
  },
  // Add more achievements here
];

export const createItemInstance = (
  template: Omit<Item, "id">
): Item => ({
  ...template,
  id: template.stackable ? template.baseId : uuidv4(),
});
