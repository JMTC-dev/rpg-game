import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../@/components/ui/card";
import { Button } from "../@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { Character } from "../types";

interface CharacterCustomizerProps {
  heroClasses: any[];
  onCreateHero: (hero: Character) => void;
}

const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  heroClasses,
  onCreateHero,
}) => {
  const [selectedClass, setSelectedClass] = useState(heroClasses[0]);

  const createHero = () => {
    const newHero: Character = {
      name: selectedClass.name,
      level: 1,
      hp: selectedClass.baseHp,
      maxHp: selectedClass.baseHp,
      baseDamage: selectedClass.baseMinDamage,
      bonusDamage: 0,
      xp: 0,
      gold: 0,
      equipment: { weapon: null, armor: null },
      inventory: [],
      skills: selectedClass.skills,
      effects: [],
    };
    onCreateHero(newHero);
  };

  return (
    <Card className='bg-gray-800 border-gray-700 max-w-md mx-auto'>
      <CardHeader>
        <h2 className='text-2xl font-bold text-yellow-400'>
          Create Your Hero
        </h2>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Select
          onValueChange={(value: string) =>
            setSelectedClass(
              heroClasses.find((c) => c.name === value) ||
                heroClasses[0]
            )
          }
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select a class' />
          </SelectTrigger>
          <SelectContent>
            {heroClasses.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className='w-full' onClick={createHero}>
          Start Adventure
        </Button>
      </CardContent>
    </Card>
  );
};

export default CharacterCustomizer;
