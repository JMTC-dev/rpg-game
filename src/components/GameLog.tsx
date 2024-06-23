import React, { useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../@/components/ui/card";
import { ScrollArea } from "../@/components/ui/scroll-area";

interface GameLogProps {
  logs: string[];
}

const GameLog: React.FC<GameLogProps> = React.memo(({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <Card className='bg-gray-800 border-gray-700'>
      <CardHeader>
        <h3 className='text-xl font-bold text-gray-300'>Game Log</h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-40'>
          {logs.map((log, index) => {
            let className = "text-gray-300";
            if (log.includes("defeated"))
              className = "text-red-400 font-bold";
            if (log.includes("Found")) className = "text-yellow-400";
            if (log.includes("Level Up"))
              className = "text-green-400 font-bold";
            if (log.includes("Achievement"))
              className = "text-purple-400 font-bold";
            return (
              <p key={index} className={className}>
                {log}
              </p>
            );
          })}
          <div ref={logEndRef} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

export default GameLog;
