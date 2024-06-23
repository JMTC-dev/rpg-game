import React from "react";
import { Card, CardContent } from "../@/components/ui/card";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className='min-h-screen bg-gray-900 text-white p-4'>
    <div className='max-w-7xl mx-auto space-y-4'>
      <Card className='bg-gray-800 border-gray-700'>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  </div>
);

export default Layout;
