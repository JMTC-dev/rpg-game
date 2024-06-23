import React from "react";
import { Item, ItemEffect } from "../types";

const ItemTooltip: React.FC<{ item: Item }> = ({ item }) => (
  <div className='p-2 bg-gray-800 rounded shadow-lg border border-gray-700'>
    <p className={`font-bold text-lg ${getRarityColor(item.rarity)}`}>
      {`${item.name}`}
      <p className='text-sm mb-1'>
        {capitalizeFirstLetter(item.rarity)}{" "}
      </p>
    </p>
    <p className='text-gray-300'>
      Type: {capitalizeFirstLetter(item.type)}
    </p>
    <div className='mt-2'>
      <p className='font-semibold text-gray-200'>Effects:</p>
      {item.effects.map((effect, index) => (
        <p key={index} className='text-gray-300 ml-2'>
          • {generateEffectDescription(effect)}
        </p>
      ))}
    </div>
    <p className='mt-2 text-yellow-400'>Value: {item.value} gold</p>
    {item.stackable && (
      <p className='text-gray-400 text-sm'>Stackable</p>
    )}
  </div>
);

export const getRarityColor = (rarity: string): string => {
  const rarityColors: { [key: string]: string } = {
    common: "text-gray-400",
    rare: "text-blue-400",
    unique: "text-purple-400",
    legendary: "text-orange-400",
    godlike: "text-red-400",
  };
  return rarityColors[rarity] || "text-white";
};

export const generateEffectDescription = (
  effect: ItemEffect
): string => {
  switch (effect.type) {
    case "damage":
      return `Damage +${effect.value}`;
    case "health":
      return `Health +${effect.value}`;
    case "poison":
      return `Poison (${effect.value} damage for ${effect.duration} turns)`;
    case "stun":
      return `Stun (${effect.duration} turns)`;
    default:
      return "";
  }
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ItemTooltip;
