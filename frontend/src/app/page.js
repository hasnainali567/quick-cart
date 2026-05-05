import Image from "next/image";
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Hello
        </CardTitle>
      </CardHeader>
      <CardContent>
        Hi how are you
      </CardContent>
      <CardFooter>
        <Button>
          Say Hi
        </Button>
      </CardFooter>
    </Card>
  );
}
