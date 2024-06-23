import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../@/components/ui/tooltip";
import { Button } from "../@/components/ui/button";
import { Sword, Shield, Zap } from "lucide-react";
import { Character, Skill } from "../types";

interface SkillsCardProps {
  hero: Character;
  onUseSkill: (index: number) => void;
}

const SkillsCard: React.FC<SkillsCardProps> = ({
  hero,
  onUseSkill,
}) => (
  <Card className='bg-gray-800 border-gray-700'>
    <CardHeader>
      <h3 className='text-xl font-bold text-blue-400'>Skills</h3>
    </CardHeader>
    <CardContent>
      <div className='grid grid-cols-3 gap-2'>
        {hero.skills.map((skill, index) => (
          <SkillButton
            key={skill.name}
            hero={hero}
            skill={skill}
            onClick={() => onUseSkill(index)}
            disabled={skill.currentCooldown > 0}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

const SkillButton: React.FC<{
  hero: Character;
  skill: Skill;
  onClick: () => void;
  disabled: boolean;
}> = React.memo(({ hero, skill, onClick, disabled }) => {
  const buttonText = `${skill.name}${
    skill.currentCooldown > 0
      ? ` (${Math.ceil(skill.currentCooldown / 1000)}s)`
      : ""
  }`;

  const getSkillIcon = (skillName: string) => {
    switch (skillName.toLowerCase()) {
      case "slash":
        return <Sword className='w-6 h-6' />;
      case "block":
        return <Shield className='w-6 h-6' />;
      case "whirlwind":
        return <Zap className='w-6 h-6' />;
      default:
        return <Sword className='w-6 h-6' />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            disabled={disabled}
            variant={disabled ? "outline" : "default"}
            className='w-full h-16 flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white'
          >
            {getSkillIcon(skill.name)}
            <span className='mt-1 text-xs'>{buttonText}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side='top'
          className='w-64 p-0 bg-gray-800 border-gray-700'
        >
          <DamageTooltip hero={hero} skill={skill} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

const DamageTooltip: React.FC<{ hero: Character; skill: Skill }> =
  React.memo(({ hero, skill }) => {
    const totalDamage = hero.baseDamage + hero.bonusDamage;
    const minDamage = totalDamage + skill.damage;
    const maxDamage = Math.floor(totalDamage * 1.5) + skill.damage;

    return (
      <div className='p-2 bg-gray-800 text-white rounded shadow-lg border border-gray-700'>
        <h3 className='text-blue-400 font-bold border-b border-gray-700 pb-1 mb-2'>
          {skill.name}
        </h3>
        <p className='text-sm mb-2'>{skill.description}</p>
        <p className='text-sm'>Cooldown: {skill.cooldown / 1000}s</p>
        <p className='text-sm font-bold mt-2'>Damage Calculation:</p>
        <p className='text-xs'>Base Damage: {hero.baseDamage}</p>
        <p className='text-xs'>Bonus Damage: {hero.bonusDamage}</p>
        <p className='text-xs'>Skill Damage: {skill.damage}</p>
        <p className='text-xs'>
          Total Damage Range: {minDamage} - {maxDamage}
        </p>
        <p className='text-xs italic mt-1'>
          Formula: (Base + Bonus) * (1 to 1.5) + Skill
        </p>
      </div>
    );
  });

export default SkillsCard;
