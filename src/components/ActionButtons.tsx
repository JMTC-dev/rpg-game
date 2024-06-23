import React from "react";
import { Button } from "../@/components/ui/button";
import { Backpack, Award, ShoppingCart } from "lucide-react";

interface ActionButtonsProps {
  onToggleInventory: () => void;
  onToggleAchievements: () => void;
  onToggleShop: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onToggleInventory,
  onToggleAchievements,
  onToggleShop,
}) => (
  <div className='flex space-x-2 justify-center'>
    <Button
      onClick={onToggleInventory}
      className='bg-yellow-600 hover:bg-yellow-700 text-white'
    >
      <Backpack className='mr-2 h-4 w-4' /> Inventory
    </Button>
    <Button
      onClick={onToggleAchievements}
      className='bg-green-600 hover:bg-green-700 text-white'
    >
      <Award className='mr-2 h-4 w-4' /> Achievements
    </Button>
    <Button
      onClick={onToggleShop}
      className='bg-red-600 hover:bg-red-700 text-white'
    >
      <ShoppingCart className='mr-2 h-4 w-4' /> Shop
    </Button>
  </div>
);

export default ActionButtons;
