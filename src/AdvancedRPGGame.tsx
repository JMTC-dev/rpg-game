import React, { useState, useCallback, useEffect } from "react";
import Layout from "./components/Layout";
import HeroCard from "./components/HeroCard";
import SkillsCard from "./components/SkillsCard";
import MonsterCard from "./components/MonsterCard";
import ActionButtons from "./components/ActionButtons";
import GameLog from "./components/GameLog";
import Inventory from "./components/Inventory";
import Shop from "./components/Shop";
import Achievements from "./components/Achievements";
import CharacterCustomizer from "./components/CharacterCustomizer";
import { Character, Monster, Item, Achievement } from "./types";
import {
  heroClasses,
  itemTemplates,
  initialAchievements,
} from "./gameData";
import {
  spawnMonster,
  handleMonsterDefeat,
  heroAction,
  monsterAction,
  updateCooldowns,
  checkAchievements,
  applyItemEffect,
  purchaseItem,
} from "./gameFunctions";
import { Button } from "./@/components/ui/button";

const AdvancedRPGGame: React.FC = () => {
  const [hero, setHero] = useState<Character | null>(null);
  const [monster, setMonster] = useState<Monster | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(
    initialAchievements
  );
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "combat"
  >("home");

  const logMessage = useCallback((message: string) => {
    setGameLog((prev) => [...prev, message].slice(-50));
  }, []);

  const updateHeroAndAchievements = useCallback(
    (newHero: Character) => {
      setHero(newHero);
      setAchievements((prevAchievements) =>
        checkAchievements(newHero, prevAchievements, logMessage)
      );
    },
    [logMessage]
  );

  const handleHeroAction = useCallback(
    (skillIndex: number) => {
      if (!hero || !monster) return;

      const { newHero, newMonster } = heroAction(
        hero,
        monster,
        skillIndex,
        logMessage
      );

      setHero(newHero);

      if (newMonster && newMonster.hp > 0) {
        setMonster(newMonster);
      } else if (newMonster) {
        const updatedHero = handleMonsterDefeat(
          newHero,
          newMonster,
          logMessage
        );
        updateHeroAndAchievements({
          ...updatedHero,
          skills: updatedHero.skills.map((skill) => ({
            ...skill,
            currentCooldown: 0,
          })),
        });
        setShowVictoryScreen(true);
        setTimeout(() => {
          setShowVictoryScreen(false);
          setCurrentScreen("home");
          setMonster(null);
        }, 2000);
      }
    },
    [hero, monster, logMessage, updateHeroAndAchievements]
  );

  const handleMonsterAction = useCallback(() => {
    if (!hero || !monster) return;

    const { newHero, newMonster } = monsterAction(
      hero,
      monster,
      logMessage
    );
    setMonster(newMonster);

    if (newHero.hp <= 0) {
      logMessage("Game Over! The hero has been defeated.");
      setShowCustomizer(true);
      setHero(null);
      setMonster(null);
    } else {
      updateHeroAndAchievements(newHero);
    }
  }, [hero, monster, logMessage, updateHeroAndAchievements]);

  useEffect(() => {
    if (currentScreen === "combat") {
      const gameLoop = setInterval(() => {
        setHero((prevHero) =>
          prevHero ? (updateCooldowns(prevHero) as Character) : null
        );
        setMonster((prevMonster) =>
          prevMonster
            ? (updateCooldowns(prevMonster) as Monster)
            : null
        );
      }, 1000);

      return () => clearInterval(gameLoop);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (
      monster &&
      monster.hp > 0 &&
      currentScreen === "combat" &&
      !showVictoryScreen
    ) {
      const delay = setTimeout(() => {
        handleMonsterAction();
      }, 750);

      return () => clearTimeout(delay);
    }
  }, [
    handleMonsterAction,
    monster,
    currentScreen,
    showVictoryScreen,
  ]);

  useEffect(() => {
    if (
      hero &&
      !monster &&
      currentScreen === "combat" &&
      !showVictoryScreen
    ) {
      const newMonster = spawnMonster();
      setMonster(newMonster);
      logMessage(`A ${newMonster.name} appears!`);
    }
  }, [hero, monster, logMessage, currentScreen]);

  const handleUseItem = (item: Item, quantity: number) => {
    if (!hero) return;
    const newHero = applyItemEffect(hero, item, quantity, logMessage);
    updateHeroAndAchievements(newHero);
  };

  const handleBuyItem = (itemTemplate: Omit<Item, "id">) => {
    if (!hero) return;
    const newHero = purchaseItem(hero, itemTemplate, logMessage);
    if (newHero) {
      updateHeroAndAchievements(newHero);
    }
  };

  if (showCustomizer) {
    return (
      <Layout>
        <CharacterCustomizer
          heroClasses={heroClasses}
          onCreateHero={(newHero) => {
            setHero(newHero);
            setShowCustomizer(false);
            logMessage(`${newHero.name} embarks on their adventure!`);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {currentScreen === "home" ? (
        <div className='space-y-4'>
          {hero && <HeroCard hero={hero} />}
          <ActionButtons
            onToggleInventory={() => setShowInventory(!showInventory)}
            onToggleAchievements={() =>
              setShowAchievements(!showAchievements)
            }
            onToggleShop={() => setShowShop(!showShop)}
          />
          <Button
            className='w-full'
            onClick={() => setCurrentScreen("combat")}
          >
            Start Battle
          </Button>
          {showInventory && hero && (
            <Inventory hero={hero} onUseItem={handleUseItem} />
          )}
          {showShop && hero && (
            <Shop
              hero={hero}
              shopItems={itemTemplates}
              onPurchase={handleBuyItem}
            />
          )}
          {showAchievements && (
            <Achievements achievements={achievements} />
          )}
          <GameLog logs={gameLog} />
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {hero && <HeroCard hero={hero} />}
            {hero && (
              <SkillsCard hero={hero} onUseSkill={handleHeroAction} />
            )}
            <MonsterCard monster={monster} />
          </div>
          <GameLog logs={gameLog} />
          <Button
            className='w-full'
            onClick={() => setCurrentScreen("home")}
          >
            Return to Home
          </Button>
        </div>
      )}

      {showVictoryScreen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-gray-800 p-8 rounded-lg text-center'>
            <h2 className='text-4xl font-bold mb-4 text-green-400'>
              Victory!
            </h2>
            <p className='text-xl'>
              Congratulations! You have defeated the {monster?.name}!
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdvancedRPGGame;
