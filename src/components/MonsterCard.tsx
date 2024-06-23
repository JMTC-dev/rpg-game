import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../@/components/ui/card";
import { Heart } from "lucide-react";
import { Monster } from "../types";

interface MonsterCardProps {
  monster: Monster | null;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster }) => (
  <Card className='bg-gray-800 border-gray-700'>
    <CardHeader>
      <h3 className='text-xl font-bold text-red-400'>
        {monster?.name || "No monster"}
      </h3>
    </CardHeader>
    <CardContent>
      {monster ? (
        <>
          <div className='flex items-center mb-2'>
            <Heart className='mr-2 text-red-500' />
            <div className='w-full bg-gray-700 rounded-full h-2.5'>
              <div
                className='bg-red-600 h-2.5 rounded-full'
                style={{
                  width: `${(monster.hp / monster.maxHp) * 100}%`,
                }}
              ></div>
            </div>
            <span className='ml-2'>
              {monster.hp}/{monster.maxHp}
            </span>
          </div>
          <div className='mt-2'>
            {monster.SvgComponent && <monster.SvgComponent />}
          </div>
        </>
      ) : (
        <p className='text-center text-gray-500'>
          No monster present
        </p>
      )}
    </CardContent>
  </Card>
);

export default MonsterCard;
