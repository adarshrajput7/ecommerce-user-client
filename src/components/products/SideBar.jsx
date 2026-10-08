import { setFilter } from "@/redux/filterSlice";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

const FILTER_SECTIONS = [
  {
    id: "price",
    title: "PRICE",
    options: [
      { id: "p1", label: "₹ 0.00 - ₹ 2,000", min: 0, max: 2000 },
      { id: "p2", label: "₹ 2,000 - ₹ 4,000", min: 2000, max: 4000 },
      { id: "p3", label: "₹ 4,000 - ₹ 6,000", min: 4000, max: 6000 },
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

export default function SideBar() {
  const dispatch = useDispatch()
  const [openSections, setOpenSections] = useState({
    price: true,
    gender: true,
    category: true,
    size: true,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    price: null,
    gender: [],
    category: [],
    size: [],
  });

  // Check karna ki kya Phone ya Footwear select hai
  const isGenderAndSizeDisabled = selectedFilters.category.some((cat) =>
    ["Phone", "Footwear"].includes(cat)
  );

  const toggleSection = (sectionId) => {
    // Agar disabled section hai toh collapse/expand bhi rok sakte hain
    if (isGenderAndSizeDisabled && (sectionId === "gender" || sectionId === "size")) {
      return;
    }

    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleFilterChange = (sectionId, option) => {
    setSelectedFilters((prev) => {
      let updated = { ...prev };

      if (sectionId === "price") {
        updated.price = prev.price?.id === option.id ? null : option;
      } else if (sectionId === "category") {
        const exists = prev.category.includes(option.label);
        const nextCategories = exists
          ? prev.category.filter((item) => item !== option.label)
          : [...prev.category, option.label];

        updated.category = nextCategories;

        // Agar category me Phone ya Footwear add ho gaya, toh gender aur size ko turant khali (reset) kar do
        const willBeDisabled = nextCategories.some((cat) =>
          ["Phone", "Footwear"].includes(cat)
        );
        if (willBeDisabled) {
          updated.gender = [];
          updated.size = [];
        }
      } else {
        const exists = prev[sectionId].includes(option.label);
        updated[sectionId] = exists
          ? prev[sectionId].filter((item) => item !== option.label)
          : [...prev[sectionId], option.label];
      }
      dispatch(setFilter(updated))
      console.log("Updated Filters:", updated);
      return updated;
    });
  };

  return (
    <div className="w-[25vw] h-[100vh] px-4 py-6 bg-white select-none">
      
      <h2 className="text-gray-500 text-sm font-medium pb-4">
        Products
      </h2>
      <div>
        <p>Applied filters</p>
      </div>

      <div className="pb-4 border-b border-gray-200"></div>

      {FILTER_SECTIONS.map((section) => {
        const isOpen = openSections[section.id];
        const isDisabled =
          isGenderAndSizeDisabled && (section.id === "gender" || section.id === "size");

        return (
          <div
            key={section.id}
            className={`border-b border-gray-200 transition-opacity duration-200 ${
              isDisabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            {/* Header */}
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full py-4 text-left group"
            >
              <span className="text-xs font-bold tracking-wider text-black">
                {section.title}
              </span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-700" />
              )}
            </button>

            {/* Checkboxes */}
            {isOpen && (
              <div className="pb-4 space-y-2.5">
                {section.options.map((option) => {
                  const isChecked =
                    section.id === "price"
                      ? selectedFilters.price?.id === option.id
                      : selectedFilters[section.id].includes(option.label);

                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 ${
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer group"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={() => handleFilterChange(section.id, option)}
                        className="w-4 h-4 border border-gray-300 rounded-sm accent-black cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-black">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}