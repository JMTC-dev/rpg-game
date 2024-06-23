// File: gameFunctions.ts
import {
  Character,
  Monster,
  Item,
  ItemEffect,
  Achievement,
} from "./types";
import {
  monsterTypes,
  itemTemplates,
  createItemInstance,
} from "./gameData";

export const spawnMonster = (): Monster => {
  const newMonster = {
    ...monsterTypes[Math.floor(Math.random() * monsterTypes.length)],
  };
  newMonster.skills = newMonster.skills.map((skill) => ({
    ...skill,
    currentCooldown: 0,
  }));
  return newMonster;
};

export const generateLoot = (
  monster: Monster
): { item: Item; quantity: number }[] => {
  const loot: { item: Item; quantity: number }[] = [];
  monster.lootTable.forEach((entry) => {
    if (Math.random() * 100 < entry.weight) {
      const quantity =
        Math.floor(
          Math.random() * (entry.maxQuantity - entry.minQuantity + 1)
        ) + entry.minQuantity;

      const itemTemplate = itemTemplates.find(
        (item) => item.baseId === entry.baseId
      );
      if (!itemTemplate) {
        console.error(
          `Item template not found for baseId: ${entry.baseId}`
        );
        return;
      }

      if (itemTemplate.stackable) {
        loot.push({
          item: createItemInstance(itemTemplate),
          quantity,
        });
      } else {
        // For non-stackable items, create multiple unique instances
        for (let i = 0; i < quantity; i++) {
          loot.push({
            item: createItemInstance(itemTemplate),
            quantity: 1,
          });
        }
      }
    }
  });
  return loot;
};

export const levelUp = (hero: Character): Character => {
  const newLevel = hero.level + 1;
  const newHero = {
    ...hero,
    level: newLevel,
    maxHp: Math.floor(hero.maxHp * 1.1),
    baseDamage: Math.floor(hero.baseDamage * 1.1),
    xp: hero.xp - hero.level * 100,
  };
  newHero.hp = newHero.maxHp; // Fully heal on level up
  return newHero;
};

export const applyItemEffects = (
  hero: Character,
  item: Item,
  isEquipping: boolean
): Character => {
  const newHero = { ...hero };

  if (item.equippable) {
    if (isEquipping) {
      newHero.equipment[item.type] = item;
    } else {
      newHero.equipment[item.type] = null;
    }
  }

  item.effects.forEach((effect) => {
    switch (effect.type) {
      case "damage":
        const damageChange = isEquipping
          ? effect.value
          : -effect.value;
        newHero.bonusDamage += damageChange;
        break;
      case "health":
        if (isEquipping) {
          newHero.maxHp += effect.value;
          newHero.hp = Math.min(
            newHero.hp + effect.value,
            newHero.maxHp
          );
        } else {
          newHero.maxHp -= effect.value;
          newHero.hp = Math.min(
            newHero.hp + effect.value,
            newHero.maxHp
          );
        }
        break;
      case "poison":
      case "stun":
        if (isEquipping) {
          newHero.effects.push({ ...effect });
        } else {
          newHero.effects = newHero.effects.filter(
            (e) => e.type !== effect.type
          );
        }
        break;
    }
  });

  return newHero;
};

export const addToInventory = (
  hero: Character,
  items: { item: Item; quantity: number }[]
): Character => {
  const newInventory = [...hero.inventory];
  items.forEach(({ item, quantity }) => {
    if (item.stackable) {
      const existingItemIndex = newInventory.findIndex(
        (i) => i.item.baseId === item.baseId
      );
      if (existingItemIndex !== -1) {
        newInventory[existingItemIndex].quantity += quantity;
      } else {
        newInventory.push({ item, quantity });
      }
    } else {
      // For non-stackable items, add each as a separate entry
      for (let i = 0; i < quantity; i++) {
        newInventory.push({
          item: createItemInstance(item),
          quantity: 1,
        });
      }
    }
  });
  return { ...hero, inventory: newInventory };
};

export const applyEffects = (hero: Character): Character => {
  let newHero = { ...hero };
  newHero.effects.forEach((effect) => {
    switch (effect.type) {
      case "poison":
        newHero.hp = Math.max(1, newHero.hp - effect.value);
        break;
      case "stun":
        // Implement stun logic here
        break;
    }
  });
  // Remove expired effects
  newHero.effects = newHero.effects.filter((effect) => {
    if (effect.duration !== undefined) {
      effect.duration--;
      return effect.duration > 0;
    }
    return true;
  });
  return newHero;
};

export const calculateDamage = (
  baseDamage: number,
  bonusDamage: number,
  skillDamage: number
): number => {
  const totalBaseDamage = baseDamage + bonusDamage;
  return (
    Math.floor(Math.random() * (totalBaseDamage * 0.5)) +
    totalBaseDamage +
    skillDamage
  );
};

export const handleMonsterDefeat = (
  hero: Character,
  defeatedMonster: Monster,
  logMessage: (message: string) => void
): Character => {
  const loot = generateLoot(defeatedMonster);
  const xpGained = defeatedMonster.xpReward;
  const goldGained = defeatedMonster.goldReward;

  let newHero = {
    ...hero,
    xp: hero.xp + xpGained,
    gold: hero.gold + goldGained,
  };
  newHero = addToInventory(newHero, loot);

  logMessage(
    `${defeatedMonster.name} defeated! Gained ${xpGained} XP and ${goldGained} gold.`
  );
  loot.forEach(({ item, quantity }) =>
    logMessage(`Found ${item.name} x${quantity}!`)
  );

  if (newHero.xp >= newHero.level * 100) {
    newHero = levelUp(newHero);
    logMessage(
      `Level Up! You are now level ${newHero.level}. All stats increased!`
    );
  }

  return newHero;
};

export const heroAction = (
  hero: Character,
  monster: Monster,
  skillIndex: number,
  logMessage: (message: string) => void
): { newHero: Character; newMonster: Monster | null } => {
  const skill = hero.skills[skillIndex];

  if (skill.currentCooldown > 0) {
    logMessage(`${skill.name} is still on cooldown!`);
    return { newHero: hero, newMonster: monster };
  }

  let damage = calculateDamage(
    hero.baseDamage,
    hero.bonusDamage,
    skill.damage
  );
  let newHero = { ...hero };

  // Apply skill effect
  if (skill.effect) {
    const effectResult = skill.effect(newHero);
    if (effectResult.healthChange) {
      newHero.hp = Math.min(
        newHero.hp + effectResult.healthChange,
        newHero.maxHp
      );
    }
    if (effectResult.damageMultiplier) {
      damage = Math.floor(damage * effectResult.damageMultiplier);
    }
    logMessage(effectResult.message);
  } else {
    logMessage(`Hero uses ${skill.name}!`);
  }

  // Apply hero effects (like poison)
  newHero = applyEffects(newHero);

  // Apply damage to monster
  let newMonster = {
    ...monster,
    hp: Math.max(0, monster.hp - damage),
  };
  logMessage(
    `${skill.name} deals ${damage} damage to ${monster.name}`
  );

  newHero.skills = newHero.skills.map((s, i) =>
    i === skillIndex ? { ...s, currentCooldown: s.cooldown } : s
  );

  console.log(
    `Hero used skill: ${skill.name}, cooldown set to ${skill.cooldown}`
  );

  return { newHero, newMonster };
};

export const monsterAction = (
  hero: Character,
  monster: Monster,
  logMessage: (message: string) => void
): { newHero: Character; newMonster: Monster } => {
  const availableSkills = monster.skills.filter(
    (skill) => skill.currentCooldown === 0
  );

  if (availableSkills.length === 0) {
    logMessage(`${monster.name} is preparing for its next move.`);
    return { newHero: hero, newMonster: monster };
  }

  const skill =
    availableSkills[
      Math.floor(Math.random() * availableSkills.length)
    ];
  let damage = skill.damage;

  // Apply skill effect
  if (skill.effect) {
    const effectResult = skill.effect(hero);
    if (effectResult.damageMultiplier) {
      damage = Math.floor(damage * effectResult.damageMultiplier);
    }
    logMessage(effectResult.message);
  } else {
    logMessage(`${monster.name} uses ${skill.name}!`);
  }

  const newHero = { ...hero, hp: Math.max(0, hero.hp - damage) };
  logMessage(`${monster.name} deals ${damage} damage to Hero`);

  // Set cooldown only when the skill is used
  const newMonster = {
    ...monster,
    skills: monster.skills.map((s) =>
      s.name === skill.name
        ? { ...s, currentCooldown: s.cooldown }
        : s
    ),
  };

  console.log(
    `Monster used skill: ${skill.name}, cooldown set to ${skill.cooldown}`
  );

  return { newHero, newMonster };
};

export const updateCooldowns = (
  character: Character | Monster
): Character | Monster => {
  const updatedCharacter = {
    ...character,
    skills: character.skills.map((skill) => ({
      ...skill,
      currentCooldown: Math.max(0, skill.currentCooldown - 1000),
    })),
  };

  console.log(
    `Updated cooldowns for ${character.name}:`,
    updatedCharacter.skills.map((skill) => ({
      name: skill.name,
      currentCooldown: skill.currentCooldown,
    }))
  );

  return updatedCharacter;
};

export const checkAchievements = (
  hero: Character,
  achievements: Achievement[],
  logMessage: (message: string) => void
): Achievement[] => {
  let newAchievements = [...achievements];

  if (!newAchievements[0].isUnlocked && hero.gold > 0) {
    newAchievements[0].isUnlocked = true;
    logMessage("Achievement unlocked: First Blood");
  }

  const totalItems = hero.inventory.reduce(
    (sum, invItem) => sum + invItem.quantity,
    0
  );
  if (!newAchievements[1].isUnlocked && totalItems >= 10) {
    newAchievements[1].isUnlocked = true;
    logMessage("Achievement unlocked: Treasure Hunter");
  }

  if (!newAchievements[2].isUnlocked && hero.level >= 10) {
    newAchievements[2].isUnlocked = true;
    logMessage("Achievement unlocked: Dragon Slayer");
  }

  return newAchievements;
};

export const applyItemEffect = (
  hero: Character,
  item: Item,
  quantity: number,
  logMessage: (message: string) => void
): Character => {
  let newHero: Character = { ...hero };

  if (item.equippable) {
    const isEquipping = quantity > 0;
    newHero = applyItemEffects(newHero, item, isEquipping);
    logMessage(
      `${isEquipping ? "Equipped" : "Unequipped"} ${item.name}.`
    );
  } else if (item.type === "potion") {
    newHero = applyItemEffects(newHero, item, true);
    logMessage(`Used ${item.name}.`);

    // Update inventory for potions
    newHero.inventory = newHero.inventory
      .map((invItem) =>
        invItem.item.baseId === item.baseId
          ? { ...invItem, quantity: invItem.quantity - quantity }
          : invItem
      )
      .filter((invItem) => invItem.quantity > 0);
  } else {
    logMessage("Unknown item type.");
    return hero;
  }

  return newHero;
};

export const purchaseItem = (
  hero: Character,
  itemTemplate: Omit<Item, "id">,
  logMessage: (message: string) => void
): Character | null => {
  if (hero.gold < itemTemplate.value) {
    logMessage(`Not enough gold to buy ${itemTemplate.name}.`);
    return null;
  }

  const newHero = {
    ...hero,
    gold: hero.gold - itemTemplate.value,
    inventory: [...hero.inventory],
  };

  const newItem = createItemInstance(itemTemplate);
  const existingItemIndex = newHero.inventory.findIndex(
    (i) => i.item.baseId === newItem.baseId
  );

  if (existingItemIndex !== -1 && newItem.stackable) {
    newHero.inventory[existingItemIndex] = {
      ...newHero.inventory[existingItemIndex],
      quantity: newHero.inventory[existingItemIndex].quantity + 1,
    };
  } else {
    newHero.inventory.push({ item: newItem, quantity: 1 });
  }

  logMessage(
    `Bought ${itemTemplate.name} for ${itemTemplate.value} gold!`
  );
  return newHero;
};
