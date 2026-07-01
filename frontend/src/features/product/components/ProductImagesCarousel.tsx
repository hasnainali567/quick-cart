import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Props = {
  images: string[];
  name: string;
};

const ProductImagesCarousel = ({ images, name }: Props) => {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <AspectRatio ratio={16 / 9}>
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
      </AspectRatio>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={image}
                  alt={`${name} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductImagesCarousel;
