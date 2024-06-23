import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../@/components/ui/card";
import {
  Heart,
  Award,
  ShoppingCart,
  Sword,
  Shield,
} from "lucide-react";
import { Character } from "../types";
import EquipmentItem from "./EuqipmentItem";

interface HeroCardProps {
  hero: Character;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero }) => (
  <Card className='bg-gray-800 border-gray-700'>
    <CardHeader>
      <h2 className='text-2xl font-bold text-yellow-400'>
        {hero.name} - Level {hero.level}
      </h2>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <StatBar
          icon={<Heart className='text-red-500' />}
          current={hero.hp}
          max={hero.maxHp}
          color='bg-red-600'
        />
        <StatBar
          icon={<Award className='text-yellow-500' />}
          current={hero.xp % 100}
          max={100}
          color='bg-yellow-500'
        />
      </div>
      <div className='space-y-2'>
        <StatItem
          icon={<ShoppingCart className='text-green-500' />}
          value={`${hero.gold} Gold`}
        />
        <StatItem
          icon={<Sword className='text-blue-500' />}
          value={`Damage: ${hero.baseDamage + hero.bonusDamage}`}
        />
      </div>
      <div className='space-y-2'>
        <EquipmentItem
          icon={<Sword className='text-blue-500' />}
          name='Weapon'
          value={hero.equipment.weapon?.name || "None"}
        />
        <EquipmentItem
          icon={<Shield className='text-purple-500' />}
          name='Armor'
          value={hero.equipment.armor?.name || "None"}
        />
      </div>
    </CardContent>
  </Card>
);

const StatBar: React.FC<{
  icon: React.ReactNode;
  current: number;
  max: number;
  color: string;
}> = ({ icon, current, max, color }) => (
  <div className='flex items-center'>
    {icon}
    <div className='w-full bg-gray-700 rounded-full h-2.5 ml-2'>
      <div
        className={`${color} h-2.5 rounded-full`}
        style={{ width: `${(current / max) * 100}%` }}
      ></div>
    </div>
    <span className='ml-2'>
      {current}/{max}
    </span>
  </div>
);

const StatItem: React.FC<{
  icon: React.ReactNode;
  value: string;
}> = ({ icon, value }) => (
  <div className='flex items-center space-x-2'>
    {icon}
    <span>{value}</span>
  </div>
);

export default HeroCard;
