import React, { useState } from "react";
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
import ItemTooltip from "./ItemTooltip";
import { getRarityColor } from "./ItemTooltip";

interface InventoryProps {
  hero: Character;
  onUseItem: (item: Item, quantity: number) => void;
}

const Inventory: React.FC<InventoryProps> = ({ hero, onUseItem }) => {
  const [useQuantity, setUseQuantity] = useState<number>(1);

  return (
    <Card className='bg-gray-800 border-gray-700'>
      <CardHeader>
        <h3 className='text-xl font-bold text-yellow-400'>
          Inventory
        </h3>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
          {hero.inventory.map(({ item, quantity }) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`p-2 border rounded ${getRarityColor(
                      item.rarity
                    )} relative`}
                  >
                    <p className='text-sm'>
                      {item.name} x{quantity}
                    </p>
                    {item.equippable ? (
                      <div className='mt-1 flex space-x-2'>
                        <Button
                          className={`px-2 py-1 rounded text-xs text-white ${
                            hero.equipment[item.type]?.baseId ===
                            item.baseId
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          onClick={() =>
                            onUseItem(
                              item,
                              hero.equipment[item.type]?.baseId ===
                                item.baseId
                                ? 0
                                : 1
                            )
                          }
                        >
                          {hero.equipment[item.type]?.baseId ===
                          item.baseId
                            ? "Unequip"
                            : "Equip"}
                        </Button>
                      </div>
                    ) : item.type === "potion" ? (
                      <div className='mt-1'>
                        <input
                          type='number'
                          min='1'
                          max={quantity}
                          value={useQuantity}
                          onChange={(e) =>
                            setUseQuantity(Number(e.target.value))
                          }
                          className='w-16 text-black text-sm p-1 rounded'
                        />
                        <Button
                          className='ml-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs'
                          onClick={() => onUseItem(item, useQuantity)}
                        >
                          Use
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  className='p-2 bg-gray-800 text-white rounded shadow-lg border border-gray-700'
                >
                  <ItemTooltip item={item} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;
