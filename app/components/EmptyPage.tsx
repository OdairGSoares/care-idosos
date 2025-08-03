
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EmptyPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backLink?: string;
}

const EmptyPage = ({ title, description, icon, backLink = "/dashboard" }: EmptyPageProps) => {
  return (
    <div className="care-container py-10 flex flex-col items-center">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="flex flex-col items-center text-center py-10">
          <div className="w-20 h-20 rounded-full bg-care-light-teal text-white flex items-center justify-center mb-6">
            {icon}
          </div>
          <h1 className="text-2xl font-bold mb-2 text-care-purple">{title}</h1>
          <p className="text-care-purple mb-6">{description}</p>
          <Link href={backLink}>
            <Button className="bg-care-teal hover:bg-care-dark-teal text-white">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyPage;
