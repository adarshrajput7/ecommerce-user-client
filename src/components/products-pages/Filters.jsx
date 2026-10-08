import { useMemo, useState } from "react";
import { ChevronDown, LucideEraser } from "lucide-react";
import Men from "./Men";
import { useLocation } from "react-router-dom";
import Women from "./Women";
import Collections from "./Collections";
import Footwear from "./Footwear";
import Clothing from "./Clothing";
import ActiveLifestyle from "./ActiveLifestyle";
import Mobiles from "./Mobiles";
// import Men from "./Men";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import Footer from "../Footer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaArrowUp19, FaArrowUp91 } from "react-icons/fa6";
import SearchView from "../SearchView";
import { setSort } from "@/redux/filterSlice";
import { useDispatch } from "react-redux";

const FILTERS = {
  price: [
    { label: "₹0 - ₹2,000", min: 0, max: 2000 },
    { label: "₹2,000 - ₹4,000", min: 2000, max: 4000 },
    { label: "₹4,000 - ₹10,000", min: 4000, max: 10000 },
    { label: "₹10,000 - ₹15,000", min: 10000, max: 15000 },
  ],
  gender: ["MEN", "WOMEN", "UNISEX"],
  category: ["FOOTWEAR", "CLOTHING", "MOBILES", "ACTIVE_LIFESTYLE"],
  size: ["S", "M", "L"],
};

const Filters = () => {

  const [price, setPrice] = useState(null);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [openSections, setOpenSections] = useState({ price: false, gender: false, category: false, size: false });
  const location = useLocation();
  console.log("PATHNAME:", window.location.pathname);
  console.log("HREF:", window.location.href);
  const dispatch = useDispatch();


  const toggleSection = (section) => setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  // const dispatch = useDispatch()

  const filters = useMemo(
    () => ({ price, gender, category, size }),
    [price, gender, category, size]
  );
  // dispatch(setFilter(filters))
  console.log("🚀 ~ Filters ~ filters:", filters)


  const [openFilter, setOpenFilter] = useState(false)

  return (
    <>
      <div className="flex lg:flex-row flex-col">

        {/* <Button onClick={()=>setOpenFilter(true)} className="mt-20 lg:hidden flex">Filter</Button>
        <div className={`lg:w-[25vw] w-screen lg:px-5  py-6 bg-green-300 border-r border-gray-200 lg:h-screen  h-screen lg:flex lg:flex-col flex flex-col lg:gap-5 sticky top-0 lg:mt-20 z-500 ${openFilter ? 'hidden' : 'block'}`}> */}

        <div className="flex justify-center items-center px-2 lg:hidden gap-2">
          {/* <button onClick={() => setOpenFilter(!openFilter)} className="mt-20 lg:hidden flex items-center justify-center w-1/2 border-2 border-black py-2 gap-5">
          Relevance <ChevronDown />
          </button> */}
          {/* //min to max - */}

          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="mt-20 lg:hidden flex items-center justify-center w-1/2 border-2 border-black py-2 gap-5">
              Relevance <ChevronDown />
            </button>} />
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => dispatch(setSort("low"))}>
                Price, low to high <FaArrowUp19 />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setSort("high"))}>
                Price, high to low <FaArrowUp91 />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          <button onClick={() => setOpenFilter(!openFilter)} className="mt-20 lg:hidden flex items-center justify-center w-1/2 border-2 border-black py-2 gap-5">
            {/* {openFilter ? 'Close' : 'Filter'} */}
            <HiOutlineBars3BottomLeft /> Filter {(filters.category || filters.price || filters.gender) ? "Applied" : ""}
          </button>
        </div>

        <div className={`lg:w-[25vw] w-screen lg:px-5 py-6 border-r bg-white border-gray-200 lg:h-screen h-fit flex-col gap-5 sticky top-0 lg:mt-20 z-100 ${openFilter ? 'flex' : 'hidden'} lg:flex`}>
          {/* <div
  className={`lg:w-[25vw] w-screen lg:px-5 py-6 border-r bg-white border-gray-200 h-fit flex-col gap-5 sticky top-0 mt-20 ${
    openFilter ? "flex" : "hidden"
  } lg:flex`}
> */}

          <div className="">
            <h1 className="text-3xl">Filter</h1>
            {filters && Object.values(filters).some(Boolean) ? (
              <div className="flex gap-2 flex-wrap">
                <p>Applied Filters:</p>
                {/* <p className="text-white px-2 bg-black">{filters?.price?.label}</p>
              <p className="text-white px-2 bg-black">{filters?.gender || null}</p>
              <p className="text-white px-2 bg-black">{filters?.category || null}</p> */}
                <div className="flex flex-wrap gap-2 items-center">
                  {filters?.price?.label && (
                    <p className="text-white text-xs px-3 py-1 bg-black rounded-full">{filters.price.label}</p>
                  )}
                  {filters?.gender && (
                    <p className="text-white text-xs px-3 py-1 bg-black rounded-full">{filters.gender}</p>
                  )}
                  {filters?.category && (
                    <p className="text-white text-xs px-3 py-1 bg-black rounded-full">{filters.category}</p>
                  )}
                </div>
                <p onClick={() => { setCategory(''); setPrice(''); setGender('') }} className="bg-red-100 border-2 border-red-500 px-1 text-sm cursor-pointer rounded-sm flex justify-center items-center py-0.5 text-red-500"><LucideEraser size={18} /> Clear Filter </p>
              </div>
            ) : null}
          </div>
          {/* PRICE */}
          <div>
            <button onClick={() => toggleSection("price")} className="w-full flex items-center justify-between py-3 hover:bg-gray-100 rounded px-2 transition-colors">
              <p className="font-medium text-gray-900">PRICE</p>
              <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${openSections.price ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.price ? "max-h-96" : "max-h-0"}`}>
              <div className="space-y-2 px-2 pb-2">
                {FILTERS.price.map((item) => (
                  <label key={item.label} className="flex gap-2 cursor-pointer group">
                    <input type="checkbox" checked={price?.label === item.label} onChange={() => setPrice(price?.label === item.label ? null : item)} className="h-4 w-4 accent-black" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* GENDER */}
          <div>
            <button onClick={() => toggleSection("gender")} className="w-full flex items-center justify-between py-3 hover:bg-gray-100 rounded px-2 transition-colors">
              <p className="font-medium text-gray-900">GENDER</p>
              <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${openSections.gender ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.gender ? "max-h-96" : "max-h-0"}`}>
              <div className="space-y-2 px-2 pb-2">
                {FILTERS.gender.map((item) => (
                  <label key={item} className="flex gap-2 cursor-pointer group">
                    <input type="checkbox" checked={gender === item} onChange={() => setGender(gender === item ? "" : item)} className="h-4 w-4 accent-black" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <button onClick={() => toggleSection("category")} className="w-full flex items-center justify-between py-3 hover:bg-gray-100 rounded px-2 transition-colors">
              <p className="font-medium text-gray-900">CATEGORY</p>
              <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${openSections.category ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.category ? "max-h-96" : "max-h-0"}`}>
              <div className="space-y-2 px-2 pb-2">
                {FILTERS.category.map((item) => (
                  <label key={item} className="flex gap-2 cursor-pointer group">
                    <input type="checkbox" checked={category === item} onChange={() => setCategory(category === item ? "" : item)} className="h-4 w-4 accent-black" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SIZES */}
          <div>
            <button onClick={() => toggleSection("size")} className="w-full flex items-center justify-between py-3 hover:bg-gray-100 rounded px-2 transition-colors">
              <p className="font-medium text-gray-900">SIZES</p>
              <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${openSections.size ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.size ? "max-h-96" : "max-h-0"}`}>
              <div className="space-y-2 px-2 pb-2">
                {FILTERS.size.map((item) => (
                  <label key={item} className="flex gap-2 cursor-pointer group">
                    <input type="checkbox" checked={size === item} onChange={() => setSize(size === item ? "" : item)} className="h-4 w-4 accent-black" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* <Collections filters={filters} /> */}
        {/* <Men filters={filters}/> */}
        {location.pathname === "/collections" && (
          <Collections filters={filters} />
        )}
        {location.pathname === "/collections-all-men" && (
          <Men filters={filters} />
        )}
        {location.pathname === "/collections-all-women" && (
          <Women filters={filters} />
        )}

        {location.pathname === "/collections-footwear" && (
          <Footwear filters={filters} />
        )}

        {location.pathname === "/collections-clothing" && (
          <Clothing filters={filters} />
        )}

        {location.pathname === "/collections-lifestyle" && (
          <ActiveLifestyle filters={filters} />
        )}

        {location.pathname === "/collections-mobiles" && (
          <Mobiles filters={filters} />
        )}

        {location.pathname === "/search" && (
          <SearchView filters={filters} />
        )}
      </div>
      <Footer />
    </>
  )
}

export default Filters






// import { useMemo, useState } from "react";
// import { ChevronDown } from "lucide-react";
// import { useLocation } from "react-router-dom";

// import Men from "./Men";
// import Women from "./Women";
// import Collections from "./Collections";
// import Footwear from "./Footwear";
// import Clothing from "./Clothing";
// import ActiveLifestyle from "./ActiveLifestyle";
// import Mobiles from "./Mobiles";

// const FILTERS = {
//   price: [
//     { label: "₹0 - ₹2,000", min: 0, max: 2000 },
//     { label: "₹2,000 - ₹4,000", min: 2000, max: 4000 },
//     { label: "₹4,000 - ₹10,000", min: 4000, max: 10000 },
//     { label: "₹10,000 - ₹15,000", min: 10000, max: 15000 },
//   ],
//   gender: ["MEN", "WOMEN", "UNISEX"],
//   category: ["FOOTWEAR", "CLOTHING", "MOBILES", "ACTIVE_LIFESTYLE"],
//   size: ["S", "M", "L"],
// };

// const Filters = () => {
//   const [price, setPrice] = useState(null);
//   const [gender, setGender] = useState("");
//   const [category, setCategory] = useState("");
//   const [size, setSize] = useState("");
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [open, setOpen] = useState({ price: false, gender: false, category: false, size: false });

//   const location = useLocation();
//   const filters = useMemo(() => ({ price, gender, category, size }), [price, gender, category, size]);
//   const hasFilters = Object.values(filters).some(Boolean);

//   const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
//   const clear = () => { setPrice(null); setGender(""); setCategory(""); setSize(""); };

//   const Section = ({ title, name, items, value, setValue }) => (
//     <div>
//       <button onClick={() => toggle(name)} className="w-full flex justify-between items-center py-3 px-2 hover:bg-gray-100 rounded">
//         <span className="font-medium">{title}</span>
//         <ChevronDown size={18} className={`transition-transform ${open[name] ? "rotate-180" : ""}`} />
//       </button>
//       <div className={`overflow-hidden transition-all duration-300 ${open[name] ? "max-h-96" : "max-h-0"}`}>
//         <div className="space-y-2 px-2 pb-2">
//           {items.map((item) => {
//             const label = typeof item === "string" ? item : item.label;
//             const checked = typeof item === "string" ? value === item : value?.label === item.label;
//             return (
//               <label key={label} className="flex gap-2 items-center cursor-pointer">
//                 <input type="checkbox" checked={checked} onChange={() => setValue(checked ? (typeof item === "string" ? "" : null) : item)} className="h-4 w-4 accent-black" />
//                 <span className="text-sm">{label}</span>
//               </label>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );

//   const FilterContent = () => (
//     <>
//       <div>
//         <h1 className="text-3xl">Filter</h1>
//         {hasFilters && (
//           <div className="flex gap-2 flex-wrap mt-2">
//             <span className="w-full text-sm">Applied Filters:</span>
//             {price && <span className="text-white px-2 py-1 bg-black text-sm">{price.label}</span>}
//             {gender && <span className="text-white px-2 py-1 bg-black text-sm">{gender}</span>}
//             {category && <span className="px-2 py-1 bg-green-300 border-2 border-green-500 text-green-800 text-sm">{category}</span>}
//             {size && <span className="px-2 py-1 bg-blue-200 border-2 border-blue-500 text-blue-800 text-sm">{size}</span>}
//             <button onClick={clear} className="bg-red-200 border-2 border-red-500 px-2 py-1 text-sm">Clear Filter</button>
//           </div>
//         )}
//       </div>

//       <Section title="PRICE" name="price" items={FILTERS.price} value={price} setValue={setPrice} />
//       <Section title="GENDER" name="gender" items={FILTERS.gender} value={gender} setValue={setGender} />
//       <Section title="CATEGORY" name="category" items={FILTERS.category} value={category} setValue={setCategory} />
//       <Section title="SIZES" name="size" items={FILTERS.size} value={size} setValue={setSize} />
//     </>
//   );

//   const Products = () => (
//     <>
//       {location.pathname === "/collections" && <Collections filters={filters} />}
//       {location.pathname === "/collections-all-men" && <Men filters={filters} />}
//       {location.pathname === "/collections-all-women" && <Women filters={filters} />}
//       {location.pathname === "/collections-footwear" && <Footwear filters={filters} />}
//       {location.pathname === "/collections-clothing" && <Clothing filters={filters} />}
//       {location.pathname === "/collections-lifestyle" && <ActiveLifestyle filters={filters} />}
//       {location.pathname === "/collections-mobiles" && <Mobiles filters={filters} />}
//     </>
//   );

//   return (
//     <div className="w-full">

//       {/* Mobile + Tablet */}
//       <div className="lg:hidden px-4 py-4 mt-16">
//         <button onClick={() => setMobileOpen(!mobileOpen)} className="w-full flex justify-between items-center border border-black px-4 py-3 bg-white">
//           <span>FILTER</span>
//           <ChevronDown className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
//         </button>

//         <div className={`grid transition-all duration-300 ${mobileOpen ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"}`}>
//           <div className="overflow-hidden">
//             <div className="border border-gray-200 p-4 flex flex-col gap-3">
//               <FilterContent />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex w-full">

//         {/* Desktop */}
//         <aside className="hidden lg:flex w-[25vw] shrink-0 px-5 py-6 bg-white border-r border-gray-200 h-screen sticky top-0 mt-20 flex-col gap-5 overflow-y-auto">
//           <FilterContent />
//         </aside>

//         {/* Products */}
//         <main className="flex-1 min-w-0">
//           <Products />
//         </main>

//       </div>
//     </div>
//   );
// };

// export default Filters;