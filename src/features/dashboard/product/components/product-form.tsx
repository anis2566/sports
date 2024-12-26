"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, SearchIcon, Send, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import queryString from "query-string"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible"

import { ProductSchema, ProductSchemaType } from "../schema"
import { useGetCategoryForSelect } from "../api/use-get-category-for-select"
import { useDebounce } from "@/hooks/use-debounce"
import { useGetBrandForSelect } from "../api/use-get-brand-for-select"
import { TagsInput } from "@/components/ui/tag-input"
import { ColorPicker } from "@/components/ui/color-picker"
import { ImageUploader } from "@/components/ui/image-uploader"
import { LoadingButton } from "@/components/loading-button"
import { useCreateProduct } from "../api/use-create-product"

export const ProductForm = () => {
    const [hasDiscount, setHasDiscount] = useState<boolean>(false)
    const [categoryQuery, setCategoryQuery] = useState<string>("")
    const [brandQuery, setBrandQuery] = useState<string>("")

    const pathname = usePathname()
    const router = useRouter()

    const debouncedQuery = useDebounce(categoryQuery, 500);
    const debouncedBrandQuery = useDebounce(brandQuery, 500);

    const { mutate: createProduct, isPending } = useCreateProduct()

    const { data: categories, isLoading: isLoadingCategories } = useGetCategoryForSelect()
    const { data: brands, isLoading: isLoadingBrands } = useGetBrandForSelect()


    useEffect(() => {
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    categoryQuery: debouncedQuery,
                },
            },
            { skipEmptyString: true, skipNull: true },
        );

        router.push(url);
    }, [debouncedQuery, router, pathname]);

    useEffect(() => {
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    brandQuery: debouncedBrandQuery,
                },
            },
            { skipEmptyString: true, skipNull: true },
        );

        router.push(url);
    }, [debouncedBrandQuery, router, pathname]);

    const handleReset = () => {
        setCategoryQuery("")
        router.push(pathname)
    }

    const form = useForm<ProductSchemaType>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            name: "",
            description: "",
            brandId: "",
            categoryId: "",
            tags: [],
            variants: [
                {
                    name: "",
                    stock: 0,
                    color: "",
                    images: [],
                    price: 0,
                    discountPrice: 0,
                }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants",
    })

    const handleDeleteImage = (index: number, image: string) => {
        const updatedImages = form.getValues("variants")[index].images.filter((img) => img !== image)
        form.setValue(`variants.${index}.images`, updatedImages)
    }

    const onSubmit = (data: ProductSchemaType) => {
        createProduct(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-y-auto pb-20">
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Identity</CardTitle>
                            <CardDescription>Give your product a unique identity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-y-2">
                                        <FormLabel>Category</FormLabel>
                                        <DropdownMenu>
                                            <FormControl>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="flex justify-start" disabled={isPending || isLoadingCategories}>
                                                        {field.value
                                                            ? categories?.find((category) => category.id === field.value)?.name
                                                            : "Select Category"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </FormControl>
                                            <DropdownMenuContent className="w-full min-w-[300px] px-2">
                                                <div className="relative w-full">
                                                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="search"
                                                        placeholder="Search..."
                                                        className="w-full appearance-none bg-background pl-8 shadow-none"
                                                        onChange={(e) => setCategoryQuery(e.target.value)}
                                                        value={categoryQuery}
                                                        autoFocus
                                                    />
                                                </div>
                                                <DropdownMenuSeparator />
                                                {
                                                    isLoadingCategories && (
                                                        <div className="flex justify-center items-center h-20">
                                                            <Loader className="h-4 w-4 animate-spin" />
                                                        </div>
                                                    )
                                                }
                                                {!isLoadingCategories && categories?.map((category) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={category.id}
                                                        checked={category.id === field.value}
                                                        onCheckedChange={() => field.onChange(category.id)}
                                                        onSelect={() => handleReset()}
                                                    >
                                                        {category.name}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="brandId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-y-2">
                                        <FormLabel>Brand</FormLabel>
                                        <DropdownMenu>
                                            <FormControl>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="flex justify-start" disabled={isPending || isLoadingBrands}>
                                                        {field.value
                                                            ? brands?.find((brand) => brand.id === field.value)?.name
                                                            : "Select Brand"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </FormControl>
                                            <DropdownMenuContent className="w-full min-w-[300px] px-2">
                                                <div className="relative w-full">
                                                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="search"
                                                        placeholder="Search..."
                                                        className="w-full appearance-none bg-background pl-8 shadow-none"
                                                        onChange={(e) => setBrandQuery(e.target.value)}
                                                        value={brandQuery}
                                                        autoFocus
                                                    />
                                                </div>
                                                <DropdownMenuSeparator />
                                                {
                                                    isLoadingBrands && (
                                                        <div className="flex justify-center items-center h-20">
                                                            <Loader className="h-4 w-4 animate-spin" />
                                                        </div>
                                                    )
                                                }
                                                {!isLoadingBrands && brands?.map((brand) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={brand.id}
                                                        checked={brand.id === field.value}
                                                        onCheckedChange={() => field.onChange(brand.id)}
                                                        onSelect={() => handleReset()}
                                                    >
                                                        {brand.name}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <TagsInput
                                                value={field.value || []}
                                                onValueChange={field.onChange}
                                                placeholder="Enter your product tags"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {
                        fields.map((field, index) => (
                            <Card key={field.id}>
                                <CardHeader>
                                    <CardTitle>Variant {form.watch(`variants.${index}.name`) || index + 1}</CardTitle>
                                    <CardDescription>Fill the details of this variant</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.color`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-y-2">
                                                <FormLabel>Color</FormLabel>
                                                <ColorPicker
                                                    value={field.value || "#FFFFFF"}
                                                    onChange={field.onChange}
                                                    disabled={isPending}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.stock`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} disabled={isPending} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} disabled={isPending} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="terms" checked={hasDiscount} onCheckedChange={() => setHasDiscount(!hasDiscount)} disabled={isPending} />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Has Discount?
                                            </label>
                                        </div>

                                        <Collapsible open={hasDiscount}>
                                            <CollapsibleContent>
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.discountPrice`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Discount Price</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} disabled={isPending} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.images`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Images</FormLabel>
                                                {
                                                    field.value?.length > 0 ? (
                                                        <div className="flex items-center gap-x-4">
                                                            {
                                                                field.value.map((image, imageIndex) => (
                                                                    <div className="relative" key={imageIndex}>
                                                                        <div className="relative aspect-square max-h-[100px]">
                                                                            <Image src={image} alt="Profile" height={100} width={100} className="object-cover rounded-full" />
                                                                        </div>
                                                                        <Button type="button" variant="destructive" className="absolute right-0 top-0 rounded-full" onClick={() => handleDeleteImage(index, image)} disabled={isPending}>
                                                                            <Trash2 className="h-5 w-5" />
                                                                        </Button>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    ) : (
                                                        <FormControl>
                                                            <ImageUploader
                                                                preset="product"
                                                                onChange={values => {
                                                                    console.log(values)
                                                                    field.onChange(values)
                                                                }}
                                                                multiple={true}
                                                                disabled={isPending}
                                                            />
                                                        </FormControl>
                                                    )
                                                }
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </CardContent>
                                <CardFooter className="flex justify-end gap-x-2">
                                    <Button type="button" variant="ghost" onClick={() => remove(index)} disabled={isPending}>
                                        <Trash2 className="h-5 w-5 text-red-500" />
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => append({
                                        name: "",
                                        stock: 0,
                                        color: "",
                                        images: [],
                                        price: 0,
                                        discountPrice: 0,
                                    })} disabled={isPending}>
                                        Add Variant
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    }
                </div>

                <LoadingButton
                    type="submit"
                    title="Submit"
                    loadingTitle="Submitting..."
                    className="mt-4"
                    onClick={form.handleSubmit(onSubmit)}
                    isLoading={isPending}
                    icon={Send}
                />
            </form>
        </Form>
    )
}