import { DeliveryBanner2 } from "@/components/delivery-banner2"
import { BestSellingProducts } from "@/features/home/components/best-selling"
import { Discount } from "@/features/home/components/discount"
import { FeatureCategories } from "@/features/home/components/feature-categories"
import { ForYou } from "@/features/home/components/for-you"
import { Newsletter } from "@/features/home/components/newsletter"
import { RecentlyAddedProducts } from "@/features/home/components/recently-added"
import { Slider } from "@/features/home/components/slider"
import { TopCategories } from "@/features/home/components/top-categories"
import { TrendingProducts } from "@/features/home/components/trending-products"

const Home = () => {
  return (
    <div className="mt-4 space-y-12">
      <Slider />
      <TopCategories />
      <TrendingProducts />
      <DeliveryBanner2 />
      <ForYou />
      <Discount />
      <FeatureCategories />
      <RecentlyAddedProducts />
      <BestSellingProducts />
      <Newsletter />
    </div>
  )
}

export default Home