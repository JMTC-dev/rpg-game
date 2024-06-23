import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../@/components/ui/card";
import { Achievement } from "../types";

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({
  achievements,
}) => (
  <Card className='bg-gray-800 border-gray-700'>
    <CardHeader>
      <h3 className='text-xl font-bold text-purple-400'>
        Achievements
      </h3>
    </CardHeader>
    <CardContent>
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`mb-2 ${
            achievement.isUnlocked
              ? "text-green-400"
              : "text-gray-400"
          }`}
        >
          <p className='font-bold'>{achievement.name}</p>
          <p>{achievement.description}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default Achievements;
