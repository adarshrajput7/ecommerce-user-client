import usePageTitle from "@/hooks/usePageTitle"
import CategoryHome from "./CategoryHome"
import FeaturedSwiper from "./FeaturedSwiper"
import Hero from "./Hero"
import HomeLast from "./HomeLast"


const Home = () => {
    // usePageTitle('Home | MyApp', '/icons/home.png');
    usePageTitle('Home', '/icons/home.png');
  return (
      <div className=''>
          <Hero />
          <FeaturedSwiper headingTitle='Featured' />
          <CategoryHome />
          <HomeLast/>
      </div>
  )
}

export default Home