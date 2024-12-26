import { Slider } from "@/features/home/components/slider"
import { TopCategories } from "@/features/home/components/top-categories"
import { TrendingProducts } from "@/features/home/components/trending-products"

const Home = () => {
  return (
    <div className="mt-4 space-y-12">
      <Slider />
      <TopCategories />
      <TrendingProducts />
      {/* <TrendingBooks />
      <DeliveryBanner2 />
      <ForYou />
      <ShamsPublicationBook />
      <Discount /> 
      <FeatureCategory />
      <RecentlyAdded /> */}
      {/* <BestSellers /> */}
      {/* <BestSelling />
      <Newsletter />  */}
    </div>
  )
}

export default Home