import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// type Props = {};

const IncomingOrders = () => {
  const navigate = useNavigate();
  return (
    <Card className=" w-[300px] md:w-[350px] max-h-[94%] overflow-y-auto relative shrink-0 scrollbar-none py-0">
      <CardHeader className="bg-accent sticky top-0 py-4 gap-0">
        <CardTitle className="uppercase text-lg font-poppins font-semibold">
          Incoming Orders
        </CardTitle>
        <CardDescription>You have 0 pending orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <Card>
          <CardHeader className="">
            <CardTitle>Order #123</CardTitle>
            <CardDescription>Placed on 2022-01-01</CardDescription>
          </CardHeader>
          <CardFooter className="w-full flex items-center gap-2 p-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              View
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="">
            <CardTitle>Order #123</CardTitle>
            <CardDescription>Placed on 2022-01-01</CardDescription>
          </CardHeader>
          <CardFooter className="w-full flex items-center gap-2 p-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              View
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="">
            <CardTitle>Order #123</CardTitle>
            <CardDescription>Placed on 2022-01-01</CardDescription>
          </CardHeader>
          <CardFooter className="w-full flex items-center gap-2 p-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              View
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="">
            <CardTitle>Order #123</CardTitle>
            <CardDescription>Placed on 2022-01-01</CardDescription>
          </CardHeader>
          <CardFooter className="w-full flex items-center gap-2 p-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              View
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="">
            <CardTitle>Order #123</CardTitle>
            <CardDescription>Placed on 2022-01-01</CardDescription>
          </CardHeader>
          <CardFooter className="w-full flex items-center gap-2 p-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              View
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate(`/store/orders/`)}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
};

export default IncomingOrders;
