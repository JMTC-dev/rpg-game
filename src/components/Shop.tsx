import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../@/components/ui/card";
import { Button } from "../@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../@/components/ui/tooltip";
import { Character, Item } from "../types";
import ItemTooltip, { getRarityColor } from "./ItemTooltip";

interface ShopProps {
  hero: Character;
  shopItems: Omit<Item, "id">[];
  onPurchase: (item: Omit<Item, "id">) => void;
}

const Shop: React.FC<ShopProps> = ({
  hero,
  shopItems,
  onPurchase,
}) => (
  <Card className='bg-gray-800 border-gray-700'>
    <CardHeader>
      <h3 className='text-xl font-bold text-green-400'>Shop</h3>
    </CardHeader>
    <CardContent>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
        {shopItems.map((item) => (
          <TooltipProvider key={item.baseId}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={`w-full p-2 ${getRarityColor(
                    item.rarity
                  )} rounded disabled:opacity-50`}
                  onClick={() => onPurchase(item)}
                  disabled={hero.gold < item.value}
                >
                  {item.name} ({item.value} gold)
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='p-2 bg-gray-800 text-white rounded shadow-lg border border-gray-700'
              >
                <ItemTooltip item={item as Item} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Shop;
