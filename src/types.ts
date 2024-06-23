export type Item = {
  id: string;
  baseId: string;
  name: string;
  type: string;
  equippable?: boolean;
  rarity: string;
  effects: ItemEffect[];
  value: number;
  stackable: boolean;
};

export interface ItemEffect {
  type: "damage" | "health" | "poison" | "stun";
  value: number;
  duration?: number;
}

export interface Skill {
  name: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
  description: string;
  effect?: (hero: Character) => {
    healthChange?: number;
    damageMultiplier?: number;
    message: string;
  };
}

export interface Character {
  name: string;
  hp: number;
  maxHp: number;
  baseDamage: number;
  bonusDamage: number;
  level: number;
  xp: number;
  gold: number;
  equipment: {
    [key: string]: Item | null;
    weapon: Item | null;
    armor: Item | null;
  };
  inventory: { item: Item; quantity: number }[];
  skills: Skill[];
  effects: ItemEffect[];
}

export interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  xpReward: number;
  goldReward: number;
  SvgComponent: React.FC<React.SVGProps<SVGSVGElement>>; // Changed to React.FC
  lootTable: LootTableEntry[];
  skills: Skill[];
}

export interface LootTableEntry {
  baseId: string;
  weight: number;
  minQuantity: number;
  maxQuantity: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
}
