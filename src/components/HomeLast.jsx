// import menWear from '../assets/category-images/men-wear.png'
// import womenWear from '../assets/category-images/women-weaar.png'

// const HomeLast = () => {
//     return (
//         <div className="lg:flex w-screen h-screen overflow-hidden mt-10 mb-5">

//             {/* LEFT IMAGE */}
//             <div className="w-[50vw] flex flex-col justify-end pl-3">

//                 {/* IMAGE */}
//                 <div className="w-[35vw] h-[35vw] hover:w-[45vw] hover:h-[45vw] overflow-hidden transition-all duration-700 ease-out">
//                     <p className="text-xs text-right">00. // Women Wear</p>
//                     <img src={menWear} alt="Women's wear" className="w-full h-full object-cover" />
//                 </div>

//                 {/* CONTENT - image ke bahar, bottom me */}
//                 <div className="mt-4">
//                     <h1 className='text-2xl font-bold'>Menswear</h1>
//                     <p className='text-sm'>Movement in every form</p>

//                     <button className="px-6 py-3 bg-black text-white rounded-full mt-3">
//                         Shop Now
//                     </button>
//                 </div>

//             </div>


//             {/* RIGHT IMAGE */}
//             <div className="w-[50vw] flex flex-col justify-end">

//                 {/* IMAGE */}
//                 <div className="w-[35vw] h-[35vw] hover:w-[45vw] hover:h-[45vw] overflow-hidden transition-all duration-700 ease-out">
//                     <p className="text-xs text-right">00. // Women Wear</p>
//                     <img src={womenWear} alt="Women's wear" className="w-full h-full object-cover" />
//                 </div>

//                 {/* CONTENT - image ke bahar, bottom me */}
//                 <div className="mt-4">
//                     <h1 className='text-2xl font-bold'>Womenswear</h1>
//                     <p className='text-sm'>Movement in every form</p>

//                     <button className="px-6 py-3 bg-black text-white rounded-full mt-3">
//                         Shop Now
//                     </button>
//                 </div>

//             </div>


//         </div>
//     )
// }

// export default HomeLast



import { useNavigate } from 'react-router-dom'
import menWear from '../assets/category-images/men-wear.png'
import womenWear from '../assets/category-images/women-weaar.png'
// import fashionImg from '../assets/category-images/fashion.png'

const HomeLast = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="flex flex-col lg:flex-row w-[98vw] min-h-screen lg:h-screen overflow-hidden mt-10 mb-5 gap-10 lg:gap-0">

                {/* LEFT IMAGE */}
                <div className="w-full lg:w-[50vw] flex flex-col justify-end px-2 lg:pl-3 group">

                    {/* IMAGE */}
                    <div className="w-full sm:w-[80vw] lg:w-[35vw] h-[80vw] sm:h-[80vw] lg:h-[35vw] lg:group-hover:w-[45vw] lg:group-hover:h-[45vw] overflow-hidden transition-all duration-700 ease-out">
                        <p className="text-xs text-right">00. // Men Wear</p>
                        <img
                         src={menWear} alt="Men's wear" className="w-full h-full object-cover" />
                    </div>

                    {/* CONTENT */}
                    <div className="mt-4">
                        <h1 className='text-2xl font-bold'>Menswear</h1>
                        <p className='text-sm'>Movement in every form</p>

                        <button onClick={()=>navigate('/collections-all-men')} className="px-6 py-3 bg-black text-white rounded-full mt-3">
                            Shop Now
                        </button>
                    </div>

                </div>


                {/* RIGHT IMAGE */}
                <div className="w-full lg:w-[50vw] flex flex-col justify-end px-2  lg:px-0 group">

                    {/* IMAGE */}
                    <div className="w-full sm:w-[80vw] lg:w-[35vw] h-[80vw] sm:h-[80vw] lg:h-[35vw] lg:group-hover:w-[45vw] lg:group-hover:h-[45vw] overflow-hidden transition-all duration-700 ease-out">
                        <p className="text-xs text-right">00. // Women Wear</p>
                        <img src={womenWear} alt="Women's wear" className="w-full h-full object-cover" />
                    </div>

                    {/* CONTENT */}
                    <div className="mt-4">
                        <h1 className='text-2xl font-bold'>Womenswear</h1>
                        <p className='text-sm'>Movement in every form</p>

                        <button onClick={()=>navigate('/collections-all-women')} className="px-6 py-3 bg-black text-white rounded-full mt-3">
                            Shop Now
                        </button>
                    </div>

                </div>

            </div>


            <div>
                <img
                    // src={fashionImg}
                    src='https://plus.unsplash.com/premium_photo-1668485967921-117d77bb7779?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    alt=""
                    className="w-full h-[90vh] object-cover aspect-video"
                />
                <div className='flex flex-col gap-2 items-center py-5 px-4'>
                    <h1 className='text-2xl font-bold'>An Ode to Passion</h1>
                    <p className='text-sm'>"A collection built around the heritage of style. Find one that's yours."</p>
                    <button onClick={()=>navigate('/collections')} className='px-8 p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all'>View The Collection</button>
                </div>
            </div>

        </>
    )
}

export default HomeLast