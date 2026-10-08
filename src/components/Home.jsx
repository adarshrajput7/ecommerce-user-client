import CategoryHome from "./CategoryHome"
import FeaturedSwiper from "./FeaturedSwiper"
import Hero from "./Hero"
import HomeLast from "./HomeLast"


const Home = () => {
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