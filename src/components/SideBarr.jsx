import { setFilter } from "@/redux/filterSlice";
import { ChevronDown, } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
// import Products from "./Products";
// import Mobiles from "./products/Mobiles";
// import Footwear from "./products/Footwear";
// import ActiveLifestyle from "./products/ActiveLifestyle";
import ProductDashboard from "./products/ProductDashboard";
import Women from "./products-pages/Women";
import { useLocation } from "react-router-dom";

const FILTERS = [
    {
        id: "price",
        title: "PRICE",
        options: [
            { id: "p1", label: "₹ 0.00 - ₹ 2,000", min: 0, max: 2000 },
            { id: "p2", label: "₹ 2,000 - ₹ 4,000", min: 2000, max: 4000 },
            { id: "p3", label: "₹ 10,000 - ₹ 15,000", min: 10000, max: 15000 },
        ],
    },
    {
        id: "gender",
        title: "GENDER",
        options: [
            { id: "male", label: "Male" },
            { id: "female", label: "Female" },
        ],
    },
    {
        id: "category",
        title: "CATEGORY",
        options: [
            { id: "phone", label: "Phone" },
            { id: "footwear", label: "Footwear" },
            { id: "clothes", label: "Clothes" },
            { id: "lifestyle", label: "Lifestyle" },
        ],
    },
    {
        id: "size",
        title: "SIZE",
        options: [
            { id: "s", label: "S" },
            { id: "m", label: "M" },
            { id: "l", label: "L" },
        ],
    },
];

export default function SideBarr() {
    const location = useLocation();
    const dispatch = useDispatch();

    // Selected filters
    const [filters, setFilters] = useState({
        price: null,
        gender: [],
        category: [],
        size: [],
    });

    // Ek time par sirf ek dropdown open hoga
    const [open, setOpen] = useState(null);

    // Phone/Footwear select hone par Gender aur Size disable
    const isDisabled = filters.category.some((cat) =>
        ["Phone", "Footwear"].includes(cat)
    );

    // Checkbox select/unselect
    const handleFilterChange = (sectionId, option) => {
        setFilters((prev) => {
            let updated;

            // PRICE -> sirf 1 select
            if (sectionId === "price") {
                updated = {
                    ...prev,
                    price:
                        prev.price?.id === option.id
                            ? null
                            : option,
                };
            }

            // Baaki sab -> sirf 1 select
            else {
                const current = prev[sectionId]?.[0];

                updated = {
                    ...prev,
                    [sectionId]:
                        current === option.label
                            ? []
                            : [option.label],
                };

                // Phone/Footwear select hua to Gender + Size clear
                if (
                    sectionId === "category" &&
                    ["Phone", "Footwear"].includes(option.label)
                ) {
                    updated.gender = [];
                    updated.size = [];
                }
            }

            // Redux update
            dispatch(setFilter(updated));
            setFilter(updated)
            console.log("Updated Filters:", filters);

            return updated;
        });
    };

    return (
        <div className="flex mt-20">

            {/* SIDEBAR */}
            {/* <div className="w-[25vw] h-screen px-4 py-6 hidden bg-pink-400 lg:block"> */}
            <div className="sticky  left-0 top-0 z-40 hidden h-screen w-[25vw] shrink-0 pt-30 bg-pink-300 px-4 py-6 lg:block">

                <h2 className="text-gray-500 text-sm pb-4">
                    Products
                </h2>

                <div className="flex gap-3">
                    <h1 className="">Applied filters</h1>
                    {/* <p>{filters?.price}</p> */}
                    {/* <p className="bg-black text-white px-1 rounded-sm flex gap-2">{filters.gender}<span>x</span></p>
                    <p>{filters.category}</p>
                    <p>{filters.size}</p> */}
                </div>

                <div className="border-b border-gray-200 mt-4" />

                {FILTERS.map((section) => {
                    const isOpen = open === section.id;

                    // /women page par Male option hide hoga
                    const visibleOptions =
                        location.pathname === "/women" && section.id === "gender"
                            ? section.options.filter((option) => option.id !== "male")
                            : section.options;

                    // Gender/Size disable condition
                    const sectionDisabled =
                        isDisabled &&
                        ["gender", "size"].includes(section.id);

                    return (
                        <div
                            key={section.id}
                            className={`border-b border-gray-200 ${sectionDisabled ? "opacity-40" : ""
                                }`}
                        >
                            {/* DROPDOWN HEADER */}
                            <button
                                type="button"
                                disabled={sectionDisabled}
                                onClick={() =>
                                    setOpen(isOpen ? null : section.id)
                                }
                                className="flex w-full items-center justify-between py-4"
                            >
                                <span className="text-xs font-bold tracking-wider">
                                    {section.title}
                                </span>

                                <span
                                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                                        }`}
                                >
                                    <ChevronDown size={16} />
                                </span>
                            </button>

                            {/* OPTIONS */}
                            <div
                                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen && !sectionDisabled
                                        ? "grid-rows-[1fr]"
                                        : "grid-rows-[0fr]"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="pb-4 space-y-2.5">
                                        {visibleOptions.map((option) => {
                                            const checked =
                                                section.id === "price"
                                                    ? filters.price?.id === option.id
                                                    : filters[section.id]?.[0] ===
                                                    option.label;

                                            return (
                                                <label
                                                    key={option.id}
                                                    className="flex cursor-pointer items-center gap-3"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() =>
                                                            handleFilterChange(
                                                                section.id,
                                                                option
                                                            )
                                                        }
                                                        className="h-4 w-4 accent-black"
                                                    />

                                                    <span className="text-sm text-gray-700">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>

            {/* PRODUCTS */}
            {/* {filters.category.includes("Phone") && (
                <Mobiles propsInput={filters} />
            )} */}

            {/* Footware */}
            {/* {filters.category.includes("Footwear") && (
                <Footwear propsInput={filters} />
            )} */}

            {/* Lifestyle */}
            {/* {filters.category.includes("Lifestyle") && (
                <ActiveLifestyle propsInput={filters} />
            )} */}

            {/* Clothes */}
            {/* {filters.category.includes("Clothes") && (
                <Products propsInput={filters} />
            )} */}

            {/* {filters && (
                <ProductDashboard propsInput={filters} />
            )} */}

            {/* <Women propsInput={filters} /> */}

            {location.pathname === "/women" && (
                <Women propsInput={filters} />
            )}

            {location.pathname === "/products" && (
                <ProductDashboard propsInput={filters} />
            )}
        </div>
    );
}
