
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Palette, Text, Check, Map, Upload, Image, Circle, Heart, Star, Square, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import TShirtPreview from "./TShirtPreview";
import OrderConfirmationDialog from "./OrderConfirmationDialog";
import { useAuth } from "@/context/AuthContext";
import AddressCheckDialog from "./AddressCheckDialog";

const formSchema = z.object({
  design: z.enum(["template", "custom", "customWithImage"], {
    required_error: "Please select a design option",
  }),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"], {
    required_error: "Please select a size",
  }),
  color: z.enum(["White", "Black", "Navy", "Gray", "Red"], {
    required_error: "Please select a color",
  }),
  customText: z.string().max(50, "Text must be less than 50 characters").optional(),
  customNote: z.string().max(200, "Notes must be less than 200 characters").optional(),
  quantity: z.number().min(1).max(10),
  imagePlacement: z.enum(["above", "below", "behind", "overlay"]).optional(),
  fontFamily: z.enum(["sans", "serif", "cursive"]).optional(),
  imageShape: z.enum(["square", "circle", "heart", "star"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Define a type that matches the orderDetails prop type from OrderConfirmationDialog
type OrderDetails = {
  design: string;
  size: string;
  color: string;
  quantity: number;
  customText?: string;
  customNote?: string;
  customImage?: string;
  imagePlacement?: string;
  fontFamily?: string;
  imageShape?: string;
};

const PreOrderForm = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addressCheckOpen, setAddressCheckOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      design: "template",
      size: "M",
      color: "Navy",
      customText: "",
      customNote: "",
      quantity: 1,
      imagePlacement: "below",
      fontFamily: "sans",
      imageShape: "square",
    },
  });

  const designType = form.watch("design");
  const selectedColor = form.watch("color");
  const customText = form.watch("customText");
  const imagePlacement = form.watch("imagePlacement");
  const fontFamily = form.watch("fontFamily");
  const imageShape = form.watch("imageShape");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomImage(event.target.result as string);
        // Automatically switch to customWithImage design type when image is uploaded
        form.setValue("design", "customWithImage");
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  const onSubmit = (values: FormValues) => {
    console.log(values);
    
    // Check if user has an address
    if (!user || !user.user_metadata?.address) {
      setAddressCheckOpen(true);
      return;
    }
    
    // If we get here, the user has an address or we're proceeding anyway
    // Ensure we're setting all required properties
    setOrderDetails({
      design: values.design,
      size: values.size,
      color: values.color,
      quantity: values.quantity,
      customText: values.customText,
      customNote: values.customNote,
      customImage: customImage || undefined,
      imagePlacement: values.imagePlacement,
      fontFamily: values.fontFamily,
      imageShape: values.imageShape,
    });
    setDialogOpen(true);
    toast({
      title: "Pre-Order Submitted!",
      description: "We've received your custom t-shirt order.",
    });
  };

  const proceedWithOrder = () => {
    setAddressCheckOpen(false);
    
    // Get current form values
    const values = form.getValues();
    
    // Proceed with order
    setOrderDetails({
      design: values.design,
      size: values.size,
      color: values.color,
      quantity: values.quantity,
      customText: values.customText,
      customNote: values.customNote,
      customImage: customImage || undefined,
      imagePlacement: values.imagePlacement,
      fontFamily: values.fontFamily,
      imageShape: values.imageShape,
    });
    setDialogOpen(true);
    toast({
      title: "Pre-Order Submitted!",
      description: "We've received your custom t-shirt order.",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-serif font-bold text-navy-800 mb-4">Customize Your T-Shirt</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Design Type */}
              <FormField
                control={form.control}
                name="design"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Design Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select design type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="template">Use Our Templates</SelectItem>
                        <SelectItem value="custom">Custom Text Only</SelectItem>
                        <SelectItem value="customWithImage">Custom Text with Image</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Custom Image Upload - Shown only for customWithImage design type */}
              {(designType === "customWithImage") && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel className="font-medium flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Custom Image
                    </FormLabel>
                    {customImage && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCustomImage(null)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    onClick={triggerImageUpload}
                    className="w-full bg-muted text-muted-foreground hover:bg-muted/80"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {customImage ? "Change Image" : "Upload Image"}
                  </Button>
                  {customImage && (
                    <div className="mt-2 relative w-full h-24 overflow-hidden rounded-md border">
                      <img 
                        src={customImage} 
                        alt="Custom uploaded design" 
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload a PNG or JPG image (max 5MB)
                  </p>
                </div>
              )}
              
              {/* Image Shape - Only for customWithImage */}
              {(designType === "customWithImage" && customImage) && (
                <FormField
                  control={form.control}
                  name="imageShape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4" />
                          Image Shape
                        </div>
                      </FormLabel>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value} 
                        className="grid grid-cols-2 gap-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="square" id="shape-square" />
                          </FormControl>
                          <FormLabel htmlFor="shape-square" className="flex items-center gap-1 cursor-pointer">
                            <Square className="h-4 w-4" /> Square
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="circle" id="shape-circle" />
                          </FormControl>
                          <FormLabel htmlFor="shape-circle" className="flex items-center gap-1 cursor-pointer">
                            <Circle className="h-4 w-4" /> Circle
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="heart" id="shape-heart" />
                          </FormControl>
                          <FormLabel htmlFor="shape-heart" className="flex items-center gap-1 cursor-pointer">
                            <Heart className="h-4 w-4" /> Heart
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="star" id="shape-star" />
                          </FormControl>
                          <FormLabel htmlFor="shape-star" className="flex items-center gap-1 cursor-pointer">
                            <Star className="h-4 w-4" /> Star
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Image Placement - Only for customWithImage */}
              {(designType === "customWithImage" && customImage) && (
                <FormField
                  control={form.control}
                  name="imagePlacement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Image Placement
                        </div>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select placement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="above">Above Text</SelectItem>
                          <SelectItem value="below">Below Text</SelectItem>
                          <SelectItem value="behind">Behind Text</SelectItem>
                          <SelectItem value="overlay">Overlay with Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Font Family - For custom text */}
              {(designType === "custom" || designType === "customWithImage") && (
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        <div className="flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Font Style
                        </div>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sans" className="font-sans">Sans-serif</SelectItem>
                          <SelectItem value="serif" className="font-serif">Serif</SelectItem>
                          <SelectItem value="cursive" className="font-cursive">Cursive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Size */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Color
                      </div>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Navy">Navy</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Text - Show for both custom and customWithImage */}
              {(designType === "custom" || designType === "customWithImage") && (
                <FormField
                  control={form.control}
                  name="customText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        <div className="flex items-center gap-2">
                          <Text className="h-4 w-4" />
                          Custom Text
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter text to print on shirt..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* T-Shirt Preview */}
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-sm font-medium text-navy-600 mb-2">Preview</h4>
              <TShirtPreview 
                color={selectedColor}
                customText={customText}
                designType={designType}
                customImage={customImage}
                imagePlacement={imagePlacement}
                fontFamily={fontFamily}
                imageShape={imageShape}
                className="mb-2"
              />
              <p className="text-xs text-navy-500 italic mt-2">Preview (Colors may vary slightly)</p>
            </div>
          </div>

          {/* Custom Notes - For both design types */}
          <FormField
            control={form.control}
            name="customNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  <div className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Additional Notes
                  </div>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific requirements or placement instructions..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-navy-800 hover:bg-navy-900 text-white py-6">
            <Check className="mr-2 h-4 w-4" />
            Add to Pre-Order
          </Button>
        </form>
      </Form>

      {/* Address Check Dialog */}
      <AddressCheckDialog
        open={addressCheckOpen}
        onOpenChange={setAddressCheckOpen}
        onProceed={proceedWithOrder}
      />

      {/* Confirmation Dialog */}
      <OrderConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderDetails={orderDetails}
      />
    </div>
  );
};

export default PreOrderForm;
